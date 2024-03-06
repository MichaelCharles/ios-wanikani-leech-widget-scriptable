// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: torii-gate;

/* 
  Leech Widget version 0.0.4
  Join the conversation on the Wanikani community forums!
  https://community.wanikani.com/t/scriptable-ios-wanikani-leeches-widget/53682
*/

/*
  You can hard code your API Token here if you'd like, though
  it would probably be better to add your token as the "Parameter"
  in the widget settings.
*/
const apiKey = args.widgetParameter || '';

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

  let r = new Request(`https://leeches.rosshendry.com/leeches`);
  r.headers = { "Authorization": "Bearer " + apiKey };
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

    if (json.leeches.length === 0) {
      return makeNoLeechNotice();
    }

    const index = Math.floor(Math.random() * (json.leeches.length - 1));
    const type = json.leeches[index].type

    switch (type) {
      case "kanji":
        listwidget.backgroundColor = new Color(kanjiColor);
        await buildLeechWidget(listwidget, type, json.leeches[index]);
        break;
      case "vocabulary":
        listwidget.backgroundColor = new Color(vocabColor);
        await buildLeechWidget(listwidget, type, json.leeches[index]);
        break;
      default:
    }

    return listwidget
  } catch (e) {
    console.log(e);
    throw e;
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

async function buildLeechWidget(listwidget, type, json) {
  const subject_id = json.subject_id
  const { reading, meaning } = await getSubjectInfo(type, subject_id);
  let textColor = vocabTextColor;
  let shadowColor = vocabShadowColor;
  if (type === "kanji") {
    textColor = kanjiTextColor;
    shadowColor = kanjiShadowColor;
  }

  let fSize = bigSize;
  if (json.name.length !== 1) fSize = bigSize - ((json.name.length) * 4);
  if (fSize < smallSize) fSize = smallSize;
  let target = listwidget.addText(json.name);
  target.centerAlignText();
  target.font = Font.blackRoundedSystemFont(fSize)
  target.textColor = new Color(textColor);
  shadow(target, fSize, shadowColor);

  listwidget.addSpacer(spacerSize);

  let rt = listwidget.addText(reading);
  rt.centerAlignText();
  rt.font = Font.lightSystemFont(smallSize);
  rt.textColor = new Color(textColor);
  let mt = listwidget.addText(meaning);
  mt.centerAlignText();
  mt.font = Font.lightSystemFont(smallSize);
  mt.textColor = new Color(textColor);
  shadow(mt, smallSize, shadowColor);
  shadow(rt, smallSize, shadowColor);
}

async function getSubjectInfo(type, subject_id) {
  const url = 'https://api.wanikani.com/v2/subjects/' + subject_id;

  let r = new Request(url);
  r.headers = { "Authorization": "Bearer " + apiKey };
  const result = await r.loadJSON()

  const meaning = result.data.meanings.filter(a => a.primary)[0].meaning;
  const reading = result.data.readings.filter(a => a.primary)[0].reading;

  return {
    meaning,
    reading
  }
}

function shadow(target, size, color) {
  p = size * (3 / 32);

  target.shadowColor = new Color(color);
  target.shadowOffset = new Point(p, p);
  target.shadowRadius = 0.1;
}
