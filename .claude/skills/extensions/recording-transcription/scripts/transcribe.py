#!/usr/bin/env python3
"""
recording-transcription 處理腳本

用法：
  transcribe.py check   --model medium                       # 開跑前先測：能不能用本地 Whisper
  transcribe.py prepare --input a.m4a [b.m4a ...] --workdir <dir> [--chunk-minutes 10]
  transcribe.py run     --workdir <dir> [--model medium] [--lang zh]
  transcribe.py status  --workdir <dir>
  transcribe.py merge   --workdir <dir> --out <final.md>

★ 已知環境限制（2026-07-12 實測發現，寫腳本前務必看過 SKILL.md 的說明）★
本 sandbox 的網路白名單只open給 pypi.org / files.pythonhosted.org / github.com /
raw.githubusercontent.com / objects.githubusercontent.com 這類套件生態系網域，
不含 huggingface.co（faster-whisper 預設從這裡下載模型權重）。
也就是說：pip install faster-whisper 沒問題，但 WhisperModel() 第一次要抓權重檔時
會連線失敗。因此：
  - `check` 會先探測目前是否真的抓得到模型（本地已有 / 連得到 HF），不用每次都跑到
    背景任務中途才發現失敗。
  - 抓不到的話，SKILL.md 設計成改用「手機/裝置內建語音轉文字草稿」當逐字稿主要來源，
    這支腳本的 prepare/run/merge（audio → whisper）整段都變成非必要，可以整段跳過。
  - 想要在這個 sandbox 裡也能跑本地 Whisper：在自己電腦上手動下載模型檔，放到
    <本skill目錄>/models/<model名稱>/ 下（含 model.bin / config.json / tokenizer.json /
    vocabulary.txt 等檔案），下次 `check`/`run` 會自動偵測並直接用本機路徑，不再嘗試連網。

設計原則：
- 所有中繼檔案（chunks/*.wav、chunks/*.json、manifest.json）都寫在 --workdir 裡。
  SKILL.md 會指示把 workdir 放在保險庫路徑下（Resources/會議記錄/raw/.tmp-{slug}/），
  而不是 sandbox 的 /tmp —— 這樣即使這次 session 結束，下次 session 重跑 `run`
  也能從已完成的段落接著做，不用整份重來。
- `run` 是會長時間執行的階段，本腳本不自己 fork/daemonize，預期由呼叫端用
  `nohup ... &` 丟到背景執行，再用 `status` 分次輪詢進度。
- 依賴：ffmpeg / ffprobe（系統指令）、faster-whisper、opencc-python-reimplemented，
  以及 huggingface_hub 走 SOCKS proxy 時需要的 `httpx[socks]`（見 SKILL.md 環境需求）。
  只有 run / merge 才需要 import 這些套件，prepare / status 不需要。
"""
import argparse
import json
import math
import subprocess
import sys
import time
import urllib.request
from pathlib import Path


def sh(cmd, **kw):
    try:
        return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw)
    except subprocess.CalledProcessError as e:
        print(f"指令失敗: {' '.join(cmd)}\n{e.stderr}", file=sys.stderr)
        raise


def ffprobe_duration(path):
    out = sh([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path),
    ])
    return float(out.stdout.strip())


def skill_dir():
    return Path(__file__).resolve().parent.parent


def resolve_model_source(model_name):
    """回傳 (model路徑或名稱, is_local)。優先用本機手動放置的模型，避免每次都嘗試連網。"""
    local_dir = skill_dir() / "models" / model_name
    if (local_dir / "config.json").exists():
        return str(local_dir), True
    return model_name, False


def hf_reachable(timeout=5):
    try:
        urllib.request.urlopen("https://huggingface.co", timeout=timeout)
        return True
    except Exception:
        return False


def cmd_check(args):
    model_source, is_local = resolve_model_source(args.model)
    if is_local:
        print(f"OK：偵測到本機模型 {model_source}，可直接離線轉錄，不需要連網。")
        return
    if hf_reachable():
        print(f"模型 {args.model} 尚未預先下載，但目前連得到 huggingface.co，run 時會嘗試自動下載。")
    else:
        print(
            f"模型 {args.model} 尚未預先下載，且連不到 huggingface.co\n"
            "（這個 sandbox 的網路白名單通常不含 Hugging Face）。\n"
            "建議：\n"
            "  1) 改用手機/裝置內建語音轉文字草稿作為逐字稿主要來源，整段 prepare/run/merge 可以跳過；或\n"
            f"  2) 在自己電腦上手動下載模型檔，放到 {skill_dir() / 'models' / args.model} 後再重跑 check。"
        )


def cmd_prepare(args):
    workdir = Path(args.workdir)
    (workdir / "chunks").mkdir(parents=True, exist_ok=True)
    norm_path = workdir / "normalized.wav"

    inputs = [str(p) for p in args.input]
    if len(inputs) == 1:
        sh([
            "ffmpeg", "-y", "-i", inputs[0],
            "-ar", "16000", "-ac", "1",
            "-af", "highpass=f=80,loudnorm",
            str(norm_path),
        ])
    else:
        # 多檔案：先個別轉成同格式的中繼 wav，再用 concat demuxer 串接
        list_file = workdir / "concat_list.txt"
        tmp_parts = []
        with open(list_file, "w") as f:
            for i, inp in enumerate(inputs):
                part = workdir / f"_part{i}.wav"
                sh(["ffmpeg", "-y", "-i", inp, "-ar", "16000", "-ac", "1", str(part)])
                tmp_parts.append(part)
                f.write(f"file '{part.resolve()}'\n")
        sh([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
            "-af", "highpass=f=80,loudnorm", str(norm_path),
        ])
        for p in tmp_parts:
            p.unlink(missing_ok=True)
        list_file.unlink(missing_ok=True)

    duration = ffprobe_duration(norm_path)
    chunk_secs = args.chunk_minutes * 60
    n_chunks = max(1, math.ceil(duration / chunk_secs))

    manifest = {
        "duration_sec": duration,
        "chunk_minutes": args.chunk_minutes,
        "n_chunks": n_chunks,
        "chunks": [],
    }

    for i in range(n_chunks):
        start = i * chunk_secs
        chunk_path = workdir / "chunks" / f"{i:03d}.wav"
        if not chunk_path.exists():
            sh([
                "ffmpeg", "-y", "-ss", str(start), "-t", str(chunk_secs),
                "-i", str(norm_path), "-ar", "16000", "-ac", "1", str(chunk_path),
            ])
        manifest["chunks"].append({
            "index": i, "start_sec": start, "wav": str(chunk_path),
        })

    (workdir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    mins = duration / 60
    print(f"準備完成：共 {n_chunks} 段，總長 {mins:.1f} 分鐘。workdir={workdir}")


def cmd_run(args):
    from faster_whisper import WhisperModel

    workdir = Path(args.workdir)
    manifest_path = workdir / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    blocked_path = workdir / "BLOCKED"
    blocked_path.unlink(missing_ok=True)

    model_source, _is_local = resolve_model_source(args.model)
    try:
        model = WhisperModel(model_source, device="cpu", compute_type="int8")
    except Exception as e:
        msg = (
            f"本地端無法載入 Whisper 模型 {args.model}：{e}\n\n"
            "常見原因：這個 sandbox 的網路白名單不含 huggingface.co，無法自動下載模型權重。\n"
            "解法：\n"
            "1) 改用手機/裝置內建語音轉文字草稿作為逐字稿主要來源（見 SKILL.md），跳過本步驟；或\n"
            f"2) 在自己電腦上手動下載模型檔，放到 {skill_dir() / 'models' / args.model}/ "
            "（需含 model.bin, config.json, tokenizer.json, vocabulary.txt 等檔案），"
            "下次重跑會自動偵測並改用本機路徑，不再嘗試連網下載。\n"
        )
        blocked_path.write_text(msg, encoding="utf-8")
        print(msg, file=sys.stderr)
        sys.exit(1)

    for chunk in manifest["chunks"]:
        idx = chunk["index"]
        out_json = workdir / "chunks" / f"{idx:03d}.json"
        if out_json.exists():
            continue  # 已完成，跳過 —— 讓中斷後重跑可以接著做
        segments, _info = model.transcribe(
            chunk["wav"], language=args.lang, vad_filter=True
        )
        seg_list = [
            {"start": s.start, "end": s.end, "text": s.text} for s in segments
        ]
        out_json.write_text(
            json.dumps(seg_list, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"[{idx + 1}/{manifest['n_chunks']}] 完成", flush=True)

    (workdir / "DONE").touch()
    print("全部完成")


def cmd_status(args):
    workdir = Path(args.workdir)

    blocked = workdir / "BLOCKED"
    if blocked.exists():
        print("狀態：卡住（無法使用本地 Whisper 模型），詳見下方：\n")
        print(blocked.read_text(encoding="utf-8"))
        return

    manifest = json.loads((workdir / "manifest.json").read_text(encoding="utf-8"))
    total = manifest["n_chunks"]
    done = sum(
        1 for c in manifest["chunks"]
        if (workdir / "chunks" / f"{c['index']:03d}.json").exists()
    )
    finished = (workdir / "DONE").exists()
    state = "全部完成" if finished else "進行中"
    print(f"{done}/{total} 段完成（{state}）")


def cmd_merge(args):
    import opencc

    converter = opencc.OpenCC("s2twp")  # 簡體 -> 台灣繁體（含慣用詞在地化）
    workdir = Path(args.workdir)
    manifest = json.loads((workdir / "manifest.json").read_text(encoding="utf-8"))

    all_segments = []
    for chunk in manifest["chunks"]:
        idx = chunk["index"]
        out_json = workdir / "chunks" / f"{idx:03d}.json"
        if not out_json.exists():
            print(f"警告：第 {idx} 段尚未轉錄完成，合併結果會缺這段", file=sys.stderr)
            continue
        segs = json.loads(out_json.read_text(encoding="utf-8"))
        offset = chunk["start_sec"]
        for s in segs:
            text = converter.convert(s["text"].strip())
            if text:
                all_segments.append({
                    "start": s["start"] + offset,
                    "end": s["end"] + offset,
                    "text": text,
                })

    all_segments.sort(key=lambda s: s["start"])

    out_path = Path(args.out)
    out_json_path = out_path.with_suffix(".json")
    out_json_path.write_text(
        json.dumps(all_segments, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    lines = []
    for s in all_segments:
        ts = time.strftime("%H:%M:%S", time.gmtime(s["start"]))
        lines.append(f"[{ts}] {s['text']}")
    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"合併完成：{out_path}（共 {len(all_segments)} 句，另存 {out_json_path.name}）")


def main():
    ap = argparse.ArgumentParser(description="recording-transcription 處理腳本")
    sub = ap.add_subparsers(dest="command", required=True)

    p_check = sub.add_parser("check", help="開跑前先測本地 Whisper 是否可用")
    p_check.add_argument("--model", default="medium")
    p_check.set_defaults(func=cmd_check)

    p_prepare = sub.add_parser("prepare", help="正規化＋切段")
    p_prepare.add_argument("--input", nargs="+", required=True)
    p_prepare.add_argument("--workdir", required=True)
    p_prepare.add_argument("--chunk-minutes", type=int, default=10)
    p_prepare.set_defaults(func=cmd_prepare)

    p_run = sub.add_parser("run", help="轉錄（建議用 nohup 背景執行）")
    p_run.add_argument("--workdir", required=True)
    p_run.add_argument("--model", default="medium")
    p_run.add_argument("--lang", default="zh")
    p_run.set_defaults(func=cmd_run)

    p_status = sub.add_parser("status", help="查詢轉錄進度")
    p_status.add_argument("--workdir", required=True)
    p_status.set_defaults(func=cmd_status)

    p_merge = sub.add_parser("merge", help="合併段落＋簡轉繁")
    p_merge.add_argument("--workdir", required=True)
    p_merge.add_argument("--out", required=True)
    p_merge.set_defaults(func=cmd_merge)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
