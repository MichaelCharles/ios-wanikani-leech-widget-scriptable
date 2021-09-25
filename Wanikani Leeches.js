// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: torii-gate;

/* 
  Leech Widget version 0.0.2
  Join the conversation on the Wanikani community forums!
  https://community.wanikani.com/t/scriptable-ios-wanikani-leeches-widget/53682
*/

/*
  You can hard code your API Token here if you'd like, though
  it would probably be better to add your token as the "Parameter"
  in the widget settings.
*/
const apiKey = args.widgetParameter || ''

// Change default font sizes!
const bigSize = 42;
const smallSize = 16;
const spacerSize = 5;

// Change default colors!
const vocabColor = "#aa00fe";
const vocabShadowColor = "#9300dd";
const vocabTextColor = "#ffffff";
const kanjiColor = "#ff01aa";
const kanjiShadowColor = "#dd0093";
const kanjiTextColor = "#ffffff";
const radicalColor = "#01aaff";
const radicalShadowColor = "#0093dd";
const radicalTextColor = "#ffffff"

/*
  +-------------------------------------------+
  |         ONLY EDIT THE CODE BELOW          |
  |      IF YOU KNOW WHAT YOU'RE DOING!       |
  +-------------------------------------------+
*/

let widget = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentSmall();
}
Script.complete();

async function createWidget() {
  if (apiKey === '') {
    return makeApiTokenNotice();
  }

  let r = new Request(`https://wk-stats.herokuapp.com/leeches/lesson?api_key=${apiKey}`);
  const json = await r.loadJSON()

  let listwidget = false
  let iterations = 0;
  do {
    if (iterations >= 1) {
      return makeErrorNotice();
    }

    listwidget = await attemptWidgetCreation(json)
    iterations++
  } while (listwidget === false)

  return listwidget;
}

async function attemptWidgetCreation(json) {
  try {
    let listwidget = new ListWidget();
    listwidget.url = "https://wanikani.com"

    if (json.leech_lesson_items.length === 0) {
      return makeNoLeechNotice();
    }

    const index = Math.floor(Math.random() * (json.leech_lesson_items.length - 1));
    const type = json.leech_lesson_items[index].type

    switch (type) {
      case "radical":
        listwidget.backgroundColor = new Color(radicalColor);
        await buildRadicalText(listwidget, json.leech_lesson_items[index]);
        break;
      case "kanji":
        listwidget.backgroundColor = new Color(kanjiColor);
        await buildKanjiText(listwidget, json.leech_lesson_items[index]);
        break;
      case "vocabulary":
        listwidget.backgroundColor = new Color(vocabColor);
        await buildVocabText(listwidget, json.leech_lesson_items[index]);
        break;
      default:
    }

    return listwidget
  } catch (e) {
    console.log(e);
    return false;
  }
}

function makeApiTokenNotice() {
  let listwidget = new ListWidget();
  listwidget.backgroundColor = new Color("#ffaa01");

  let notice = listwidget.addText("API Token is not set.");
  notice.centerAlignText();
  notice.font = Font.blackRoundedSystemFont(smallSize)
  notice.textColor = new Color("#ffffff");
  shadow(notice, smallSize, "#dd9200");

  return listwidget;
}

function makeNoLeechNotice() {
  const color = "#008343";
  const shadowColor = "#006333";
  let listwidget = new ListWidget();
  listwidget.backgroundColor = new Color(color);

  let notice = listwidget.addText("Good job genius! ❤︎ You have no leeches!");
  notice.centerAlignText();
  notice.font = Font.blackRoundedSystemFont(smallSize)
  notice.textColor = new Color("#ffffff");
  shadow(notice, smallSize, shadowColor);

  return listwidget;
}

function makeErrorNotice() {
  let listwidget = new ListWidget();
  listwidget.backgroundColor = new Color("#ee2201");

  let notice = listwidget.addText("Oops! Something went wrong...");
  notice.centerAlignText();
  notice.font = Font.blackRoundedSystemFont(smallSize)
  notice.textColor = new Color("#ffffff");
  shadow(notice, smallSize, "#922201");

  return listwidget;
}

async function buildRadicalText(listwidget, json) {
  const type = json.leech.key.split('/')[0]
  const key = encodeURIComponent(json.leech.key.split('/')[1])
  listwidget.url = `https://wanikani.com/${type}/${key}`


  let target = listwidget.addText(json.name);
  target.centerAlignText();
  target.font = Font.blackRoundedSystemFont(bigSize)
  target.textColor = new Color(radicalTextColor);


  listwidget.addSpacer(spacerSize);

  let meaning = listwidget.addText(json.correct_answers.join(', '));
  meaning.centerAlignText();
  meaning.font = Font.lightSystemFont(smallSize);
  meaning.textColor = new Color(radicalTextColor);
  shadow(meaning, smallSize, radicalShadowColor);
}

async function buildKanjiText(listwidget, json) {
  const type = json.leech.key.split('/')[0]
  const key = encodeURIComponent(json.leech.key.split('/')[1])
  listwidget.url = `https://wanikani.com/${type}/${key}`

  const { reading, meaning } = await scrapeKanji(key);

  let target = listwidget.addText(json.name);
  target.centerAlignText();
  target.font = Font.blackRoundedSystemFont(bigSize)
  target.textColor = new Color(kanjiTextColor);
  shadow(target, bigSize, kanjiShadowColor);

  listwidget.addSpacer(spacerSize);

  let rt = listwidget.addText(reading);
  rt.centerAlignText();
  rt.font = Font.lightSystemFont(smallSize);
  rt.textColor = new Color(kanjiTextColor);
  let mt = listwidget.addText(meaning);
  mt.centerAlignText();
  mt.font = Font.lightSystemFont(smallSize);
  mt.textColor = new Color(kanjiTextColor);
  shadow(mt, smallSize, kanjiShadowColor);
  shadow(rt, smallSize, kanjiShadowColor);
}

async function buildVocabText(listwidget, json) {
  const type = json.leech.key.split('/')[0]
  const key = encodeURIComponent(json.leech.key.split('/')[1])
  listwidget.url = `https://wanikani.com/${type}/${key}`

  const { reading, meaning } = await scrapeVocab(key);

  let fSize = bigSize;
  if (json.name.length !== 1) fSize = bigSize - ((json.name.length) * 4);
  if (fSize < smallSize) fSize = smallSize;
  let target = listwidget.addText(json.name);
  target.centerAlignText();
  target.font = Font.blackRoundedSystemFont(fSize)
  target.textColor = new Color(vocabTextColor);
  shadow(target, fSize, vocabShadowColor);

  listwidget.addSpacer(spacerSize);

  let rt = listwidget.addText(reading);
  rt.centerAlignText();
  rt.font = Font.lightSystemFont(smallSize);
  rt.textColor = new Color(vocabTextColor);
  let mt = listwidget.addText(meaning);
  mt.centerAlignText();
  mt.font = Font.lightSystemFont(smallSize);
  mt.textColor = new Color(vocabTextColor);
  shadow(mt, smallSize, vocabShadowColor);
  shadow(rt, smallSize, vocabShadowColor);
}

async function scrapeVocab(item) {
  const url = `https://www.wanikani.com/vocabulary/${item}`;
  let r = new Request(url);
  const data = await r.loadString()

  try {
    const meaningChunk = data.split('<h2>Primary</h2>')[1]
    const meaning = meaningChunk.split('</div>')[0].replace(/<[^>]*>?/gm, '').trimStart().trimEnd();
    const readingChunk = meaningChunk.split('<p class="pronunciation-variant" lang="ja">')[1];
    const reading = readingChunk.split('</p>')[0].replace(/<[^>]*>?/gm, '').trimStart().trimEnd();
    return {
      meaning,
      reading
    }
  } catch (e) {
    console.log(data);
    console.log(e);
    console.log("vocabulary/" + item);
    throw e;
  }
}

async function scrapeKanji(item) {
  const url = `https://www.wanikani.com/kanji/${item}`;
  let r = new Request(url);
  const data = await r.loadString()
  try {
    const meaningChunk = data.split('<h2>Primary</h2>')[1]
    const meaning = meaningChunk.split('</div>')[0].replace(/<[^>]*>?/gm, '').trimStart().trimEnd();
    const preReadingChunk = meaningChunk.split(`<div class="span4 ">`)[1];
    const readingChunk = preReadingChunk.split(`<p lang="ja">`)[1];
    const reading = readingChunk.split('</p>')[0].replace(/<[^>]*>?/gm, '').trimStart().trimEnd();
    return {
      meaning,
      reading
    }
  } catch (e) {
    console.log(data);
    console.log(e);
    console.log("kanji/" + item);
    throw e;
  }
}

function shadow(target, size, color) {
  p = size * (3 / 32);

  target.shadowColor = new Color(color);
  target.shadowOffset = new Point(p, p);
  target.shadowRadius = 0.1;
}
