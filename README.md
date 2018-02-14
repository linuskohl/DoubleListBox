# DoubleListBox
Replace select element with a two listbox widget using jQuery/Twitter Bootstrap. Has the ability to filter options and to sort the selected elements.

![Screenshot](http://i66.tinypic.com/2isjrz9.jpg "Screenshot of the elements rendered")

### Demo
[jsFiddle](https://jsfiddle.net/p6zwwtcd/){:target="_blank"}

## Requirements
- "bootstrap": "~3.3.7"
- "jquery": "~3.2.1"

## Install  
### Via Bower
````bash
bower install double-list-box --save
````
### Manual
Include the files in your project like below
````html
<link rel="stylesheet" type="text/css" href="src/css/doublelistbox.css">
<script type="text/javascript" src="src/js/doublelistbox.js"></script>
````
## Usage
````javascript
$(function(){
    var listBox = DoubleListBox($('SELECT ELEMENT SELECTOR'));
});
````
## Documentation
### new DoubleListBox()
DoubleListBox Object

### doubleListBox.updateData([])
Update options, keeps already selected options selected
| Param | Description |
| --- | --- |
|[ ] | updates - Array of options |

### doubleListBox.destroy()
Destroys the DoubleListBox and replaces it with the original select element

## License
DoubleListBox is freely distributable under the terms of the MIT [license](https://raw.githubusercontent.com/linuskohl/DoubleListBox/master/LICENSE).
Copyright notice and permission notice shall be included in all copies or substantial portions of the Software.

## Authors
Linus Kohl / [@linuskohl](https://twitter.com/linuskohl)

