# An iOS Wanikani Leech Widget implemented using Scriptable
![IMG_9363|690x467](https://res.cloudinary.com/mca62511/image/upload/v1632580775/IMG_9363_tmwtxn.jpg)

If you already know what leeches are, and you already know what Scriptable is, then you can go ahead and grab the script from [here](https://github.com/mcaubrey/ios-wanikani-leech-widget-scriptable/blob/main/script.js). I think it should be fairly self explanatory to anyone whose added an iOS widget using Scriptable before. 

# Latest Update: September 30, 2021

Changed to use the new Shin Wanikani Leech Trainer API, and switched from scraping to using the official API. This should make it more reliable overall, as well as potentially solve the problem that some people were having where the shown item did not match the shown meaning. 

# What Are Leeches? 

The term "leech" comes from Anki. Or at least I think it does. Either way, the [Anki manual](https://docs.ankiweb.net/leeches.html) has a [good explanation](https://docs.ankiweb.net/leeches.html) of what they are. In short, leeches are radicals, kanji and vocabulary that for whatever reason you just can't seem to remember. They're the ones that you fail over and over again.

In Anki, there are various ways of dealing with this. For example, you can opt to suspend leeches automatically so that they don't get in the way of your progress.

In Wanikani, we have no choice but to squash (learn) those leeches.

Towards that effort (and also because I wanted a Wanikani related widget on my home screen) I threw together a widget that displays leeches so that you can be reminded of them every time you look at your phone.

# What Is Scriptable?

[Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188) is an automation app for iOS. It lets you write JavaScript scripts that interact with native features of iOS. You can also use it to create home screen widgets using JavaScript. 

# Getting Started

There are two ways to you can go about installing the script: Downloading it, or copy/pasting it. Choose the way that is easier for you.

## Install By Downloading To iCloud

First install the [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188) app. Open it so that it will create a folder within your iCloud folder.

From there, download [this JavaScript file](https://raw.githubusercontent.com/mcaubrey/ios-wanikani-leech-widget-scriptable/main/Wanikani%20Leeches.js) and place it inside `iCloud Drive > Scriptable`. 

After it is downloaded, you should be able to see it from within the Scriptable app on the Scripts tab.

## Install By Copy/Pasting Into The App

If the download method failed for some reason, you can copy and paste the script directly into the app. Just open [this JavaScript file](https://raw.githubusercontent.com/mcaubrey/ios-wanikani-leech-widget-scriptable/main/Wanikani%20Leeches.js) and copy the contents. Open the Scriptable app, click on the icon on the top right corner, and then paste the contents of the script.

After it is copied,  you should be able to see it from within the Scriptable app on the Scripts tab. You will need to manually change the name of the script (by default it will be "Untitled Script").

## Adding The Widget

Add the Scriptable widget just like you would any other widget. When the widget is initially added to the home screen it will say "Select script in widget configuration." While the home screen is still in edit mode, click on the widget again to bring up the widget configuration dialog.

You'll see three options that you can set: "Script," "When Interacting," and "Parameter." Click on "Script" and select the name of the Wanikani Leech widget script. If you followed the download method above, it will probably be called "Wanikani Leeches."

In the "Parameter" field, add your Wanikani API token.

And after that you should be set!

Here is a video example in case that was hard to follow.

![ezgif.com-gif-maker (1)|231x500](https://res.cloudinary.com/mca62511/image/upload/v1632580650/ezgif.com-gif-maker_1_ly08k5.gif)


# How It Works

The leeches are being pulled from the API used by the [Shin Wanikani Leech Trainer](https://community.wanikani.com/t/userscript-leech-training/36978) Userscript by Ross Hendry. From there I hit the official Wanikani API to grab details about the items. 

# Known Issues

 * In situations of low internet connectivity, it will often display as "Oops, something went wrong."