# memOrb — X / Twitter 發布方案（2026-07）

角度：**情感／身分認同**　形式：**單則主貼 + 續串**　語言：**中英各自獨立成篇（非翻譯）**

> 本文件有兩套完整貼文：
> **產品敘事版**（下方 A/B/C + 續串）— 講架構與方法論，風險低、天花板中等。
> **[個人敘事版](#-個人敘事版d-版)**（文件後段）— 講你為什麼做這個，風險高、天花板明顯更高。

---

## 🇬🇧 English

### Hero post — 3 options (pick one, keep the others for later reuse)

**A. The reveal（最推薦，梗最強、最容易被引用轉發）**

```
There's an animated film about the inside of someone's head. You know the one.

I spent six months rebuilding its architecture as a real AI memory system.

Core memories. Islands of Personality. The Forgetters, whose entire job is throwing memories away.

All of it runs. MIT:
github.com/iamjosuho/memorb
```

**B. The three-line contrast（最好懂，最適合冷啟動）**

```
Task trackers remember what you did.
Journals remember how you felt.
Nothing remembers who you became.

A certain animated film solved this ten years ago — core memories, Islands of Personality, and a crew paid to throw memories out.

I built it for real. memOrb, MIT 🔮
github.com/iamjosuho/memorb
```

**C. The confession（最適合 build-in-public 圈）**

```
Every AI memory tool I tried was a landfill with search on top.

Add, add, add. Never forget. Never decide what mattered.

The fix wasn't in an AI paper. It was in a cartoon about the inside of a kid's head — where the whole plot turns on a mind finally willing to let something go.

memOrb: github.com/iamjosuho/memorb
```

### Thread (attach to whichever hero you chose)

```
2/ Two failure modes, same root cause.

Your agent either forgets everything when the session ends, or it remembers everything as an undifferentiated chat log.

Both store. Neither metabolizes.
```

```
3/ The mapping isn't decoration. Every component is a running skill:

Core memories → one formative event, one file
Islands → your long-term domains, narrative only
Mind Workers → the skills that file and prune
The Forgetters → MUSTY-based archival

Full mapping, all three tiers: [worldview-mapping.md]
```

```
4/ The pipeline:

session → a memorb (one atomic note, one idea)
→ OrbTrack (staging)
→ Long-Term (People / Projects / Orgs)
→ monthly replay
→ Core orbs → Beliefs → Islands

Steps 1–4 run as you work. Step 5 is the only one that touches who you are.
```

```
5/ The part people don't build: forgetting.

memOrb ships a worker called The Forgetter. It runs MUSTY — Misleading, Ugly, Superseded, Trivial, Your collection doesn't need it — borrowed from the CREW library weeding method.

A memory system that only adds isn't a memory. It's a basement.
```

```
6/ Once a month, dream-studio replays your timeline and proposes:

"these three moments look formative"
"this belief has shifted"
"this Island needs rewriting"

Every single write needs your confirmation. The agent drafts who you are. It never commits it.
```

```
7/ What you actually get: plain markdown, in folders you can read without any agent running. Opens in Obsidian. Nothing proprietary, no database, no lock-in.

Agent-agnostic — Claude Code, Cursor, Windsurf, Antigravity, or anything reading a skills/ dir.
```

```
8/ npx skills add iamjosuho/memorb

MIT, free, 15 skills, no signup.

Genuine question for anyone who's built a second brain: what does yours consistently fail to remember? That's the next skill.

github.com/iamjosuho/memorb
```

---

## 🇹🇼 繁體中文

### 主貼文 — 3 種版本（擇一，其餘留給後續複用）

**A. 揭底（最推薦，梗最強）**

```
有一部關於「腦袋裡面長怎樣」的動畫電影。你知道是哪部。

我花了半年，把它的架構真的做成一套 AI 記憶系統。

核心記憶、性格島嶼，還有那群工作內容就是「把記憶丟掉」的清潔工。

全部都跑得起來。MIT 開源：
github.com/iamjosuho/memorb
```

**B. 三行對比（最好懂）**

```
待辦清單記得你做了什麼。
日記記得你當下的感覺。
沒有工具記得——你變成了誰。

某部動畫電影十年前就把答案畫出來了：核心記憶、性格島嶼，還有一群負責把記憶丟掉的人。

我把它做成真的了。memOrb，MIT 開源 🔮
github.com/iamjosuho/memorb
```

**C. 自白（最適合開發者社群）**

```
我試過的 AI 記憶工具，本質上都是「加了搜尋的垃圾掩埋場」。

一直存、一直存，從不遺忘，也從不判斷什麼才重要。

解法不在哪篇 AI 論文裡。在一部關於小孩腦袋的動畫電影——整部片的轉折，就是那顆腦袋終於願意放掉一顆記憶。

memOrb：github.com/iamjosuho/memorb
```

### 續串（接在你選的主貼下面）

```
2/
AI 的記憶只有兩種壞法：

一種是關掉視窗就全忘光，
一種是全都記得，但混成一坨查不動的對話紀錄。

都在「存」，都沒有在「消化」。
```

```
3/
這個對應不是拿來裝飾的，每一個角色都是一支跑得動的 skill：

核心記憶 → 一個關鍵事件一個檔案
性格島嶼 → 你的長期領域，只放敘述
腦內工人 → 負責歸檔與修剪的 skill
記憶清潔工 → 用 MUSTY 標準汰舊

完整三層對照表：[worldview-mapping.md]
```

```
4/
整條流程：

一次對話 → 蒸餾成一顆 memorb（一顆一個念頭）
→ OrbTrack 待分類區
→ 長期記憶（人／專案／組織）
→ 每月回放
→ 核心球 → 信念球 → 性格島嶼

前四步跟著你工作跑，第五步才碰「你是誰」。
```

```
5/
最少人做、但最關鍵的一塊：遺忘。

memOrb 內建一個叫 The Forgetter 的角色，跑的是圖書館的 MUSTY 汰舊標準——誤導的、破爛的、被取代的、瑣碎的、你的館藏根本不需要的。

只會累加的記憶系統不叫記憶，叫倉庫。
```

```
6/
每個月，dream-studio 會回放你的時間軸，然後提議：

「這三個時刻看起來很關鍵」
「這個信念好像變了」
「這座島的敘述該重寫了」

但每一次寫入都要你點頭。
AI 可以草擬你是誰，不能替你定稿。
```

```
7/
你真正拿到的東西：一堆純 markdown，資料夾結構就算不開 AI 你也讀得懂。可以直接在 Obsidian 裡用。

沒有資料庫、沒有專有格式、沒有綁定。
Claude Code、Cursor、Windsurf、Antigravity 都能跑。
```

```
8/
npx skills add iamjosuho/memorb

MIT 開源、15 個 skill、免註冊。

想問有在做第二大腦的人：你的系統最常「記不住」什麼？
那大概就是我下一個要做的 skill。

github.com/iamjosuho/memorb
```

---

## 🫀 個人敘事版（D 版）

這一版把「你為什麼做這個」放到最前面。它不推銷功能，它讓人認識你。
產品敘事版是在說「這東西怎麼運作」，這一版是在說「這東西為什麼存在」——後者才是會被存進書籤的那種貼文。

**寫法上只有一條原則：陳述，不要示弱。**
「我不太懂人情世故」寫成一句平鋪直敘的事實，讀者會覺得你坦率；一旦加上「可能是我太笨」「我這種人」，同一句話就變成討拍，力道全失。下面每一句都是照這個標準寫的。

### 🇬🇧 Hero post

**定稿**（對齊中文定稿的結構與語氣）

```
I've never been good at reading people. Not as a kid, not now.

So I talk things through with my AI — what happened today, what I should have said, how to answer better next time.
Then the session ends and it forgets.

Inside Out got to me back then. So I built its architecture for real: core memories, Islands of Personality, and the ones everyone forgets — the crew whose whole job is throwing memories away.

🔮 memOrb — a memory framework for AI agents
https://github.com/iamjosuho/memorb

What makes it different 🧵
```

兩個對應說明：

- `Not as a kid, not now.` 接的是中文「從小」那層意思。英文直譯 since childhood 太軟，斷成兩個短句才有同樣的篤定感。
- `What makes it different` 對應「有什麼特別之處」。不要寫成 `What makes it different?` — 英文的問號在 X 上一樣會把人導去留言區。陳述式的懸念句配 🧵 才是往下讀的訊號。

**280 字元版（免費帳號）**

```
I've never been good at reading people. Not as a kid, not now.

So I talk things through with my AI — what I should've said, how to do better next time. Then the session ends and it forgets.

Inside Out got to me, so I built its architecture for real.

🔮 memOrb
https://github.com/iamjosuho/memorb

What makes it different 🧵
```

### 🇬🇧 Thread

```
2/ For a while I didn't notice how much re-explaining I was doing.

Who this person is. Why that meeting mattered. What I decided last month and why.

The advice was fine. The advisor had amnesia.
```

```
3/ Which is why I went back to Inside Out.

Its whole thesis: you become whole when core memories build your Islands of Personality — and when your mind is finally willing to let some memories go.

Most people read that as a story about feelings. I read it as a spec.
```

```
4/ Under the metaphor it's three boring, established methods doing the work:

atomic notes — one orb, one idea
PARA — where each orb gets shelved
MUSTY, the library weeding criteria — what gets archived

The film is the interface. Library science is the engine.
```

```
5/ So now: every session distills into an orb. Orbs consolidate into People, Projects, Orgs.

Once a month it replays the timeline and asks me — "these three moments look formative, should they become core?"

I answer. It writes. Nothing gets written without me.
```

```
6/ The forgetting turned out to matter more than the remembering.

An advisor that holds onto every version of you can't tell you who you are now. It just averages you.

Letting go is the feature. That's the part of the film everyone remembers, and the part every memory tool skips.
```

```
7/ Six months in, the thing I didn't expect: I can see the shape of it.

Not a log of what I shipped. A record of what I kept choosing, and where I got better at things that used to be hard for me.

Task trackers can't show you that. Neither can journals.
```

```
8/ I built this to grow into a more complete person, not a more organized one. It just happens to be shaped like software.

Free, MIT, 15 skills:
npx skills add iamjosuho/memorb

If you also use your AI as a life advisor — I'd like to know what yours forgets.
```

### 🇹🇼 主貼文

**定稿**（Zic 自己改寫的版本，微調三處）

```
我從小就不太懂人情世故。

所以遇到事情，我習慣跟 AI 討論——今天發生什麼、我當時該怎麼說、下次怎麼回比較好。
但每次關掉視窗，它就全忘了。

那時候《腦筋急轉彎》很打動我。於是我照著它的架構，實作了一套記憶：核心記憶、性格島嶼，還有大家都會忘記的那群人——負責把記憶丟掉的清潔工。

🔮 memOrb — 給 AI agent 的記憶框架
https://github.com/iamjosuho/memorb

有什麼特別之處 🧵
```

微調的三處與理由：

1. `從小時候我不太懂` → `我從小就不太懂` — 純語序，讀起來順一點。
2. `感動了我，受到啟發` → `很打動我` — 兩個詞在做同一件事，留感性的那個。「受到啟發」偏書面報告語氣，會把你前面累積的真誠感稀釋掉。
3. 結尾從「為什麼我會做這個」換成 **「有什麼特別之處」** — 主貼已經把 why 講完了，再問一次等於在承諾一個讀者已經拿到的答案，往下讀的動力反而消失。換成「特別在哪」才是真的懸念，而且續串 4/5/6 三則（三個方法論、每月回放、刻意遺忘）正好就在回答它。
   句尾的「呢」我拿掉了：`有什麼特別之處呢` 語氣偏聊天、力道散；`有什麼特別之處 🧵` 比較像在下戰帖。要留也可以，這是語感，不是對錯。
   另外注意**不要用問號結尾**——問號是邀請人「回答」，🧵 是邀請人「往下讀」。結尾放問號會有一部分讀者直接跑去留言區，續串閱讀率會掉。真正的問句留到最後一則 CTA 才有效。

**你加的「從小」是這一版最大的升級。** 原本寫「我不太懂人情世故」像在解釋一個當下的困擾，加上「從小」之後變成一個早就接受的事實——語氣從抱怨變成陳述，人一下就站穩了。

**精簡版（280 字元，免費帳號用）**

```
我從小就不太懂人情世故。

所以遇到事情我習慣跟 AI 討論——我當時該怎麼說、下次怎麼回比較好。
但每次關掉視窗，它就全忘了。

《腦筋急轉彎》打動了我，所以我照它的架構實作了一套記憶。

🔮 memOrb — 給 AI agent 的記憶框架
https://github.com/iamjosuho/memorb

有什麼特別之處 🧵
```

### 🇹🇼 續串

```
2/
一開始我沒發現自己重複解釋了多少事。

這個人是誰、那場會為什麼重要、上個月我做了什麼決定、為什麼。

建議本身都很好。
只是這位顧問有失憶症。
```

```
3/
所以我回頭去翻《腦筋急轉彎》。

它整部片在講一件事：核心記憶撐起你的性格島嶼，而一個人真正完整，是在他終於願意放掉某些記憶的時候。

大部分人把這當成一個關於情緒的故事。
我把它當成一份規格書。
```

```
4/
掀開這層比喻，底下是三個很無聊、但都有出處的方法：

原子筆記——一顆球一個念頭
PARA——每顆球該放到哪個架上
MUSTY 圖書館汰舊標準——什麼該被下架

電影是介面，圖書館學是引擎。
```

```
5/
現在的運作是：每次對話蒸餾成一顆球，球再匯整成人、專案、組織。

每個月它會回放整條時間軸，然後問我——
「這三個時刻看起來很關鍵，要收進核心記憶嗎？」

我回答，它才寫。沒有我點頭，它不會動任何一個字。
```

```
6/
做下去才發現，「遺忘」比「記得」重要得多。

一個把你所有版本都抓著不放的顧問，沒辦法告訴你現在的你是誰，它只會把你平均掉。

願意放手才是功能。
那是整部電影最多人記得的一段，也是所有記憶工具都跳過的一段。
```

```
7/
用了半年，最意外的收穫是：我看得到形狀了。

不是我完成了哪些事的紀錄，
是我一直在重複選擇什麼，以及——哪些以前對我很難的事，我現在做得比較好了。

待辦清單看不到這個，日記也看不到。
```

```
8/
我做這套東西，是想長成一個更完整的人，不是一個更有條理的人。
它只是剛好長得像軟體。

免費、MIT、15 支 skill：
npx skills add iamjosuho/memorb

如果你也把 AI 當人生顧問——我想知道你的那個會忘記什麼。
```

### 用這一版之前，先想清楚三件事

**一、這一版會招來真實的人，不只是 star。**
會有人在留言或私訊裡跟你講他自己的處境。這是好事，但要有心理準備——你等於公開邀請了這種對話。如果現在不想接，就先發產品敘事版，把這一版留到專案有基本聲量之後再發，效果一樣好（甚至更好，因為那時候有人已經在用了）。

**二、發了就收不回來。**
X 上的貼文會被截圖、被引用、被脫離上下文轉貼。「我不太懂人情世故」這句話在你的敘事裡是誠實，在別人的截圖裡可能只剩下標籤。你的信箱是公司信箱（vanyi.com.tw），如果不想讓同事或客戶看到這一面，這是現在就要決定的事，不是發完再說。

**三、如果決定發，就不要在留言區補救。**
最常見的失手是貼文很誠實，然後在下面追加一則「哈哈其實也沒那麼嚴重啦」。那一則會把整篇的重量抽掉。發完就讓它站著。

### 兩版都想用的最佳順序

Day 0 發**產品敘事版 A**（電影梗開場）→ 拿到第一波技術圈的認可與 star
→ Week 2 發**個人敘事版**，開頭加一句「上禮拜我貼了 memOrb 怎麼運作。沒講的是我為什麼做它。」

這個順序有兩個好處：技術可信度先建立，個人故事才不會被讀成「用故事包裝一個沒東西的專案」；而且你等於用同一個專案拿到兩次完整的曝光，而不是一次。

---

## 🧵 續串怎麼發（操作篇）

### 最推薦：用推文編輯器一次寫完，一次送出

打開發文視窗 → 打完第一則 → 按輸入框右下角的 **「+」** → 出現第二個輸入框 → 一路加到第八則 → 最後按 **Post all**。

八則會在同一秒全部發出，形成一條乾淨的鏈。這個方法直接消滅你擔心的所有問題：順序不會亂、中間不會被別人的留言插進來、也不用手忙腳亂。

**先在別的地方打好草稿再貼進去。** X 的編輯器沒有自動儲存，中途按到上一頁就全沒了。

### 如果要手動一則一則發

規則只有一條：**永遠回覆自己「最新的那一則」，不是第一則。**

```
✅ 正確（一條鏈）              ❌ 錯誤（散成一叢）

1/  主貼                       1/  主貼
└─ 2/  回覆 1/                 ├─ 2/  回覆 1/
   └─ 3/  回覆 2/              ├─ 3/  回覆 1/   ← 錯
      └─ 4/  回覆 3/           └─ 4/  回覆 1/   ← 錯
```

回錯的後果是所有續串變成第一則底下的**平行留言**，跟路人的留言混在一起排序，讀者完全拼不回原本的順序，而且 X 不會顯示「顯示這個討論串」的按鈕。

**已經回錯了怎麼辦：** 沒有辦法搬移，只能把回錯的那幾則刪掉重發。所以真的建議用上面的一次送出。

### 順序會不會隨時間亂掉

**你自己的鏈不會亂。** X 認得同一作者的連續回覆，會固定用「Show this thread ／顯示這個討論串」把它們串在一起，順序永遠照發文時間。

**但點進主貼的對話頁時，別人的留言會插在你的兩則之間。** 這是 X 的排版邏輯，改不掉——尤其是熱門留言會被拉到很前面。這也是為什麼**一次送出**很重要：全部同時發出，別人根本來不及在中間留言。

### 方便人類閱讀的四個習慣

1. **每則開頭編號 `2/` `3/`**，最後一則用 `8/8` 或直接寫 `/end`。這是排版亂掉時唯一的救命索，草稿已經編好了。
2. **每則都要能單獨看懂。** 讀者常常是從第 5 則被轉發進來的，不要寫「承上」「如前所述」這種依賴前文的句子。
3. **一則講一件事，不要塞滿。** 留白比字數重要，短句斷行的貼文閱讀完成率明顯較高。
4. **主貼 pin 到個人檔案。** 續串的長尾流量幾乎全靠這個。

### 順帶一提：連結的位置

X 對含外部連結的貼文觸及會打折。你目前把 GitHub 連結放在主貼——這是刻意的取捨：**犧牲一些觸及，換取每個看到主貼的人都能直接點進去**。以你這種「一次性發布、要導流」的情境，這個取捨是對的。

如果發出去兩小時後發現觸及明顯偏低，備案是：刪文重發一次不含連結的主貼，把連結移到第二則。但不要一開始就這樣做——多一步跳轉會流失很多人。

---

## 📣 行銷執行

### 發文前必備（缺一個就先別發）

| 項目 | 為什麼 |
|---|---|
| **一張 demo GIF / 影片（10–20 秒）** | X 演算法對原生影片權重最高。拍 dream-studio 提出「這三個時刻看起來很關鍵」然後你按確認的那一刻——這是整個專案唯一無法用文字傳達的畫面 |
| **一張資料夾結構截圖** | Obsidian 開著 `memorbs/Islands/` `memorbs/Long-Term/` `memorbs/` 三層。技術讀者三秒判斷可信度就靠這張 |
| **README 上方置頂一句話** | 從 X 點進來的人平均停留 8 秒，`banner.jpg` 下第一行就要能被抓住 |
| **Pin 主貼文到個人檔案** | 貼文的長尾流量幾乎全靠 pin |

### 時機

- **週二／三，台灣時間 21:00–23:00**（＝美東早上 9–11 點）。這是英文貼文的黃金窗口。
- 中文貼文**隔天**再發，別同日雙發稀釋互動。
- 發文後 **90 分鐘內守著回覆**。X 的早期互動速率決定觸及上限，你自己回覆的權重比別人按讚高。

### 增幅路徑（依序做，不要同天全放）

1. **Day 0** — X 主貼 + 續串，pin 起來
2. **Day 0+1h** — 主貼已經丟出電影梗，留言區一定會有人問「所以到底對應到什麼」。這時**在自己主貼下面自回一則**，貼 worldview-mapping.md 並寫「每個角色對應哪支 skill，我全列出來了」。晚一小時放，是為了讓這則自回吃到主貼的第二波流量，而不是一開始就把好奇心用完
3. **Day 1** — 中文版主貼；同時發到 Threads（台灣受眾在那裡比 X 多）
4. **Day 2** — r/ObsidianMD 與 r/PKMS。**貼文標題不要提 AI**，改用「I built a memory vault that prunes itself using library weeding criteria」。這兩個板反 AI 情緒高，但對圖書館學方法論極買單
5. **Day 3** — r/ClaudeAI、r/cursor、Claude Code Discord。這裡反過來主打 15 個 skill 的工程架構
6. **Day 5** — Hacker News Show HN。標題：`Show HN: memOrb – an agent memory system that forgets on purpose`。**週二至週四 台灣時間 21:00 送出**
7. **Week 2** — Product Hunt（要先累積前面的社群證據才有意義）

### 標籤與 @

**先講結論：D 版個人敘事貼文，一個都不要放。**

2026 年的 X 演算法用語意理解（NLP）判斷內容主題，hashtag 早就不是觸及來源。實測一致顯示 **0–2 個表現最好，3 個以上會觸發垃圾訊息過濾、實際壓低觸及**。X 官方自己的建議也只剩「1–2 個」。真正決定排名的是回覆數、書籤數與早期互動速率。

分版本的建議：

| 版本 | Hashtag | 為什麼 |
|---|---|---|
| **D 版（個人敘事）** | **0 個** | 這篇的說服力全靠「這是一個人在講自己的事」。任何一個 hashtag 都會把語氣從自白切換成行銷，讀者的防禦心會立刻升起來。這是這一版唯一不能妥協的地方 |
| **A/B/C 版（產品敘事）** | **0–1 個** | 要放就只放 `#AgentSkills`（英）或 `#Obsidian`（中），而且放在**最後一則**，不要放主貼 |
| **後續的週更內容** | 1 個 | 長期經營時 hashtag 的價值是「歸類」不是「擴散」，固定用同一個就好 |

- **絕對不要 `#InsideOut`**，理由見上面的安全用法
- 中文 hashtag（`#第二大腦`）在 X 上的搜尋量極低，幾乎沒有作用；台灣受眾要靠 Threads，不是靠標籤
- 與其花力氣選標籤，不如把同樣的力氣花在**發文後 90 分鐘內回覆每一則留言**——回覆數對排名的權重遠高於任何標籤
- 主貼**不要 @ 任何人**。等有人轉發後，再在留言區 @ 相關的人比較不像求關注
- 值得回覆互動的對象：寫 Obsidian／PKM 的創作者、Claude Code 與 Cursor 社群裡討論 memory / context 的貼文。**在別人的討論串裡給出有用的回答**比自己發十則貼文有效

### 提到《腦筋急轉彎》的安全用法

直接寫出片名是可以的——用作品名稱來描述你的靈感來源，屬於指示性合理使用（nominative fair use），開源專案這樣做非常普遍。真正的風險從來不在文字，在圖像和暗示背書。

**安全 ✅**

- 文字寫出片名：`Inside Out` ／《腦筋急轉彎》
- 描述性句型：「inspired by」「built on its architecture」「照它的架構做的」
- 沿用片中的概念名詞：core memories、Islands of Personality、Forgetters
- 個人檔案或 README 保留免責聲明（你已經寫好了，就放著別動）

**危險 ❌**

- **任何角色圖、劇照、海報、同人繪** — 這是唯一真的會收到信的一條，`banner.jpg` 和 demo GIF 都要自己檢查一遍
- 電影的專屬字體與 logo 樣式
- 任何暗示合作或授權的講法：「official」「approved」「authorized」「聯名」
- 把片名放進產品名、帳號名或網域：memOrb 就叫 memOrb，不要出現 InsideOut-something
- `#InsideOut` 當主要 hashtag — 蹭 IP 標籤最容易被檢舉，而且會把你的貼文塞進一堆影迷內容裡，觸及品質反而變差

**一句話原則：** 可以說「我從這部電影學到什麼」，不能讓人以為「這部電影跟我有關係」。

### 措辭紅線
- 不要說「取代你的筆記軟體」。memOrb 是長在 Obsidian 上的，敵意定位會直接得罪最該吸收的族群
- 不要用「revolutionary」「game-changer」這類詞。這個專案的可信度來自 MUSTY、PARA、atomic notes 這些有出處的方法論，形容詞會把它拉低成又一個 AI wrapper

### 追蹤指標（發文後 72 小時）

| 指標 | 及格線 | 意義 |
|---|---|---|
| GitHub star | 30+ | 貼文有打到人 |
| 連結點擊 ÷ 曝光 | > 2% | hook 有效 |
| 回覆數 ÷ 按讚數 | > 10% | 有引發討論，不只是禮貌讚 |

如果 72 小時後 star 少於 10，問題幾乎一定出在 hero post 的第一行，而不是產品——換上面另一個版本重發一次，別急著改 README。

### 後續內容節奏（讓專案有連載感，比單次爆發重要）

- **每週一則**「dream-studio 這個月從我的記錄裡撈出什麼」——去識別化後的真實輸出。這是唯一無法被別人抄走的內容
- **每月一則**「memOrb 這個月刪掉了什麼」。反直覺、有記憶點，且直接強化「會遺忘」這個差異點
- 有人在留言區問到你沒做的功能時，做出來、然後回到那則留言下面告訴他。這種公開回饋迴圈是小專案最有效的成長引擎
