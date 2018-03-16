/**
* DoubleListBox
*
* @author Linus Kohl <linus@munichresearch.com>
* @copyright Copyright &copy; 2017 Linus Kohl
* @license MIT
* lol
* @link https://github.com/linuskohl/DoubleListBox
*
*/

/**
* DoubleListBox Object
* @constructor
*/
var DoubleListBox = function(element, settings) {
    "use strict";


    var self = this;

    self.pluginName = 'yii2_doublelistbox';
    self.sel_id_dst = element.attr("id");
    self.sel_id_src = this.sel_id_dst + "_all";
    self.el_dst = "#" + this.sel_id_dst;
    self.el_src = "#" + this.sel_id_src;
    self.dst = $(this.el_dst);
    self.src = $(this.el_src);

    self.settings = settings;

    // default settings
    self.defaults = {
        "availableLabel": "Available",
        "selectedLabel": "Selected",
        "timeout": 400
    };

    /**
     * Build the DOM and replace the original select element
     */
    self.buildDOM = function () {

        var button_template = $("<button>", {"class": "btn btn-default"});

        // generate icons
        var icon_up        = $("<span>", {"class": "glyphicon glyphicon-menu-up"}).attr("aria-hidden", true);
        var icon_down      = $("<span>", {"class": "glyphicon glyphicon-menu-down"}).attr("aria-hidden", true);
        var icon_add       = $("<span>", {"class": "glyphicon glyphicon-menu-right"}).attr("aria-hidden", true);
        var icon_addAll    = $("<span>").append($("<span>", {"class": "glyphicon glyphicon-list"}).attr("aria-hidden", true))
                     .append($("<span>", {"class": "glyphicon glyphicon-menu-right"}).attr("aria-hidden", true));
        var icon_delete    = $("<span>", {"class": "glyphicon glyphicon-menu-left"}).attr("aria-hidden", true);
        var icon_deleteAll = $("<span>").append($("<span>", {"class": "glyphicon glyphicon-menu-left"}).attr("aria-hidden", true))
                     .append($("<span>", {"class": "glyphicon glyphicon-list"})).attr("aria-hidden", true);

        // generate buttons
        self.buttons           = {};
        self.buttons.up        = button_template.clone().attr("id", "up_"     + self.sel_id_dst).append(icon_up);
        self.buttons.down      = button_template.clone().attr("id", "down_"   + self.sel_id_dst).append(icon_down);
        self.buttons.add       = button_template.clone().attr("id", "add_"    + self.sel_id_dst).append(icon_add);
        self.buttons.addAll    = button_template.clone().attr("id", "addall_" + self.sel_id_dst).append(icon_addAll);
        self.buttons.delete    = button_template.clone().attr("id", "del_"    + self.sel_id_dst).append(icon_delete);
        self.buttons.deleteAll = button_template.clone().attr("id", "delall_" + self.sel_id_dst).append(icon_deleteAll);



        // generate container
        self.container = $("<div>", {"class": "doublelistbox_container"}).attr("id", "table_simple_dual_listbox_" + self.sel_id_dst);
        var row = $("<div>", {"class": "row row-eq-height"});

        // copy selected list box to available list box
        self.el_list_available = $(self.el_dst).clone();
        self.el_list_available.attr("id", self.sel_id_src).empty();
        self.el_list_available.removeAttr("name");

        var clone = $(self.el_dst).clone(true);
        self.el_list_selected  = clone.empty();

        self.src = self.el_list_available;
        self.dst = self.el_list_selected;

        // add bootstrap css class
        self.src.addClass("form-control select_box");
        self.dst.addClass("form-control select_box");

        // distribute elements based on selected attribute
        $(self.el_dst).find('option').each(function () {
            if ($(this).is(':selected')) {
                $(this).appendTo(self.dst);
            } else {
                $(this).appendTo(self.src);
            }
        });

        self.el_filter_available = $("<input>", {"class": "filter filter_left form-control", "type": "text", "placeholder":"Filter"});
        self.el_filter_selected  = $("<input>", {"class": "filter filter_right form-control","type": "text", "placeholder":"Filter"});

        // generate "available" list
        var left_column = $("<div>", {"class": "doublelistbox_left col-md-5"});
        left_column.append($("<label>", {"class": "control-label"}).text(self.settings.availableLabel));
        var left_column_header = $("<div>", {"class": "row"});
        left_column_header.append($("<div>", {"class":"col-md-12"}).append(self.el_filter_available));
        left_column.append(left_column_header);
        left_column.append(self.el_list_available);

        // generate buttons container
        var buttons_column = $("<div>", {"class": "col-md-2 doublelistbox-div-buttons-col"})
            .attr("role", "group")
            .attr("aria-label", "...");
        var buttons_container = $("<div>", {"class": "doublelistbox-div-buttons"});
        buttons_container.append(self.buttons.up);
        buttons_container.append(self.buttons.add);
        buttons_container.append(self.buttons.addAll);
        buttons_container.append(self.buttons.deleteAll);
        buttons_container.append(self.buttons.delete);
        buttons_container.append(self.buttons.down);
        buttons_column.append(buttons_container);

        // generate "selected" list
        var right_column = $("<div>", {"class": "doublelistbox_right col-md-5"});
        right_column.append($("<label>", {"class": "control-label"}).text(self.settings.selectedLabel));
        var right_column_header = $("<div>", {"class": "row"});
        right_column_header.append($("<div>", {"class":"col-md-12"}).append(self.el_filter_selected));
        right_column.append(right_column_header);
        right_column.append(self.el_list_selected);

        // aggregate row
        row.append(left_column);
        row.append(buttons_column);
        row.append(right_column);

        self.container.append(row);

        // replace original element
        self.old_element = $(self.el_dst).clone(true);
        $(self.el_dst).replaceWith(self.container);
    };


    /**
     * Update options
     * @param [] updates - Array of options
     */
    self.updateData = function (updates) {
        // make local copy
        var update_data =  JSON.parse(JSON.stringify( updates ));
        // get selected
        var selected_options = self.dst.find('option');
        // clear available list
        self.src.empty();

        // iterate over selected and remove the ones not included in update
        $.each(selected_options, function () {
            var key = $(this).attr('value');
            var text = $(this).text();
            // element not in update or text differs
            if(!(key in update_data) || update_data[key] !== text) {
                $(this).remove();
            } else {
                // delete from update
                delete update_data[key];
            }
        });

        $.each(update_data, function(value, title) {
            if(value && title) {
                self.option = $("<option>", {
                    value: value,
                    text: title
                });
                self.src.append(self.option);
            }
        });

        // trigger change events
        self.src.trigger("change");
        self.dst.trigger("change");
    };


    /**
     * Enable/disable buttons based on number of options
     */
    self.toggleButtons = function () {
        var available_has_options = self.el_list_available.find("option").length !== 0;
        var selected_has_options  = self.el_list_selected.find("option").length !== 0;

        self.buttons.add.prop("disabled", !available_has_options);
        self.buttons.addAll.prop("disabled", !available_has_options);
        self.buttons.deleteAll.prop("disabled", !selected_has_options);
        self.buttons.delete.prop("disabled", !selected_has_options);
    };

    /**
     * Moves the selected option inside the selected list up
     */
    self.move_up = function () {
        $(self.el_dst + " option:selected").each(function () {
            var newPos = $(self.el_dst + " option").index(this) - 1;
            if (newPos > -1) {
                $(self.el_dst + " option").eq(newPos).before(
                    "<option " +
                        "title=\'" + $(this).attr("title") +
                        "\' value=\'" + $(this).val() +
                        "\' selected=\'selected\'>" + $(this).text() +
                    "</option>");
                $(this).remove();
            } else {
                self.dst.trigger("change");
                return false;
            }
        });
        self.dst.trigger("change");
        return false;
    };

    /**
     * Moves a selected option inside the selected list down
     */
    self.move_down = function () {
        var cntOptions = $(self.el_dst + " option").length;
        $($(self.el_dst + " option:selected").get().reverse()).each(function () {
            var newPos = $(self.el_dst + " option").index(this) + 1;
            if (newPos < cntOptions) {
                $(self.el_dst + " option").eq(newPos).after(
                    "<option " +
                        "title=\'" + $(this).attr("title") +
                        "\' value=\'" + $(this).val() +
                        "\' selected=\'selected\'>" + $(this).text() +
                    "</option>");
                $(this).remove();

            } else {
                self.dst.trigger("change");
                return false;
            }
        });
        self.dst.trigger("change");
        return false;
    };


    /**
     * Adds the selected options from the available list to the selected list
     */
    self.add = function () {
        self.listbox_move(self.src, self.dst, false);
        return false;
    };

    /**
     * Adds all options from the available list to the selected list
     */
    self.add_all = function () {
        self.listbox_move(self.src, self.dst, true);
        return false;
    };

    /**
     * Removes the selected options from the selected list
     */
    self.delete = function () {
        self.listbox_move(self.dst, self.src, false);
        return false;
    };

    /**
     * Removes all options from the selected list
     */
    self.delete_all = function () {
        self.listbox_move(self.dst, self.src, true);
        return false;
    };

    /**
     * Moves selected options or all options from src list to dst list
     * @param {string}  src - Selector source list
     * @param {string}  dst - Selector destination list
     * @param {boolean} all - All elements
     */
    self.listbox_move = function (src, dst, all) {
        // select all elements if specified
        if (all) {
            src.find("option").prop("selected", true);
        }

        var vals   = [];
        var text   = [];
        var titles = [];

        // copy all options to arrays
        src.find($("option:selected")).each(function (i, selected) {
            vals[i]   = $(selected).val();
            text[i]   = $(selected).text();
            titles[i] = $(selected).attr("title");
        });

        // loop over selected elements and move them
        var i = 0;
        for (i = 0; i < vals.length; i++) {
            // remove option from src list
            src.find("option[value=\'" + vals[i] + "\']").remove();
            // add option to dst list
            dst.append($("<option>").attr("title", titles[i]).attr("value", vals[i]).text(text[i]));
        }

        dst.find("option").attr("selected", true);
        src.find("option").attr("selected", true);

        // trigger change events
        src.trigger("change");
        dst.trigger("change");

    };

    /**
     * Initializes filter function for a list
     * @param {string}  list - Selector for the list element
     * @param {string}  textinput - Selector for the input field
     * @param {integer} timeout - Timeout in milliseconds before the filter is applied
     */
     self.initFilter = function (list, textinput, timeout) {
        // filter is changed
        $(textinput).bind("change keyup", function () {
            // get filter string and build regexp
            var search = $.trim($(textinput).val());
            var regex = new RegExp(search, 'gi');
            // append filter to element
            list.data("filter", regex);

            self.delay(function () {
                // apply filter
                self.applyFilter(list);
            }, timeout);
        });
        // reapply filter if list is changed
        list.on("change", function() {
            self.applyFilter(list);
        });
    };

    /**
     * Applies filter to list element.
     * The filter regexp is stored in data("filter") of the list
     * @param {string}  list - Selector for the list element
     */
    self.applyFilter = function(list) {

        var filter = list.data("filter");
        var options = [];

        list.find("option").each(function () {
            options.push({value: $(this).val(), text: $(this).text()});
        });

        $(list).data('options', options);

        $.each(options, function (i) {

            if (options[i].text.match(filter) === null) {
                $(list).find($("option[value=\"" + options[i].value + "\"]")).hide();
            } else {
                $(list).find($("option[value=\"" + options[i].value + "\"]")).show();
            }
        });

        $(list).scrollTop();
    };

    /**
     * Delay function
     */
    self.delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    /**
     * Checks whether or not an element is visible
     * @author Geodan, https://github.com/Geodan
     * */
    $.fn.isVisible = function () {
        return !($(this).css('visibility') === 'hidden' || $(this).css('display') === 'none');
    };

    /**
     * Initialize the event listeners
     * */
    self.initEventListeners = function () {
        // init buttons
        self.buttons.up.click(self.move_up);
        self.buttons.down.click(self.move_down);
        self.buttons.add.click(self.add);
        self.buttons.addAll.click(self.add_all);
        self.buttons.delete.click(self.delete);
        self.buttons.deleteAll.click(self.delete_all);

        // init filter
        self.initFilter(self.src, self.el_filter_available, self.settings.timeout);
        self.initFilter(self.dst, self.el_filter_selected, self.settings.timeout);

        self.dst.on("change", function() {
            self.applyFilter($(self));
            self.toggleButtons();
        });

        self.src.on("change", function() {
            self.applyFilter($(self));
            self.toggleButtons();
        });

        // automatically select all options before submit of form
        self.dst.closest('form').submit(function() {
            self.dst.find('option').prop('selected', true);
        });
        // or if mouse leaves container
        self.container.mouseleave(function () {
            self.dst.find('option').prop('selected', true);
        });
        // prevent form submit on enter key press in filter
        self.container.find('input[type="text"]').keypress(function(e) {
            if (e.which === 13) {
                event.preventDefault();
            }
        });

    };

    /**
     * Destroys the DoubleListBox and replaces it with the original select element
     * @returns {} original select element
     * */
    self.destroy = function() {
        $(self.container).replaceWith(self.old_element);
        self.dst.data("initialized", false);
        return self.old_element;
    };

    /**
     * Initializes the DoubleListBox
     * @returns {DoubleListBox} initialized object
     * */
    self.init = function () {
        if(!self.dst.data("initialized")) {
            // apply defaults

            self.settings = $.extend({}, self.defaults, self.settings);
            // build DOM
            self.buildDOM();
            self.initEventListeners();

            self.toggleButtons();

            self.dst.data("initialized", true);
            self.dst.data("doublelistbox", self);
        }
        return self;
    };

    return self.init();
};
