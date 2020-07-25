# Ctrl-v image pasting for SMF forums
by viviridian <hi@vvn.space>

## Installation
Unzip and move all the non-patch files into the corresponding folders

Then apply the patch with:
patch -p1 < dist/mod.patch

## Usage
In the post composer, users will be able to press Ctrl-V to paste any images on their clipboard into their message.
An "inline" image attachment is created in the background. This attachment is not bound to a specific post, only the user, and is probably not affected by cleanup actions.
You can review and delete individual inline attachments in the usual attachments admin control panel.
