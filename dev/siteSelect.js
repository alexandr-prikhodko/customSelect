/**
 *
 * === select base html layout ===
 * <div class="custom_select">
 *     <span class="select_current">Default option</span>
 *     <div class="select_dropdown">
 *         <span data-value="1" class="option">Option 1</span>
 *         <span data-value="2" class="option">Option 2</span>
 *         <span data-value="3" class="option">Option 3</span>
 *     </div>
 * </div>
 *
 *
 * === default value of customSelect plugin ===
 * to set default value you need to add data attr into your ".custom_select" tag
 * like this: data-value="1" or any another value from option list
 *
 *
 * === init customSelect plugin ===
 * $(custom_select).customSelect();
 *
 *
 * === destroy customSelect plugin ===
 * $(custom_select).customSelect('destroy');
 *
 *
 * === change current value at customSelect plugin ===
 * $(custom_select).customSelect('set', 'new_value');
 * If "new_value" not present in select options list - nothing will change
 *
 *
 * === add option to customSelect plugin ===
 * $(custom_select).customSelect('add', new_value);
 * 'ew_value is an object
 * you can send whole option like html:
 *      {html:'<span data-value="4" class="option">Option 4</span>'}
 * or you can send option like data:
 *      {val:'4', text: 'option 4'} //text param is not required
 *
 *
 * === remove option from customSelect plugin ===
 * $(custom_select).customSelect('remove', 'value');
 * 'value' is option value you want to remove. if this option is selected
 * then custom_select resets selected option to first in list
 *
 *
 * === event handler for customSelect change action ===
 * $(custom_select).on('change', function(){
 *      //your action here
 *  });
 *
 * */

(function ($) {

    var methods = {
        //initialization of custom_select plugin                (don't remove it)
        init: function () {
            return this.each(function () {
                var select_obj = $(this),
                  current = select_obj.find('.select_current'),
                  options = select_obj.find('.option');

                //set first value of custom select
                if (select_obj.data('value') === undefined) {
                    //if data not added we set default value automatically
                    setDefaultValue()
                } else {
                    var select_val = select_obj.data('value'),
                      selected_option = options.filter('[data-value="' + select_val + '"]');

                    if(selected_option.length){
                        //if option exist we set default value by data attr
                        current.text(selected_option.text());
                        options.removeClass('selected');
                        selected_option.addClass('selected');
                    } else {
                        //if option not exist we set default value automatically
                        setDefaultValue()
                    }
                }

                //set current value as first option from option list
                function setDefaultValue() {
                    var first_option = options.eq(0);
                    first_option.addClass('selected');
                    current.text(first_option.text());
                    select_obj.data('value', first_option.data('value'));
                }

                //close dropdown
                function closeDropdown(select) {
                    var key = select.data('event_key');
                    select.removeClass('opened');

                    $("html").unbind('click.' + key);
                }

                //open dropdown
                function openDropdown(select) {
                    var key = new Date().getTime();//create unique event key code

                    select.addClass('opened');
                    select.data('event_key', key);

                    $('html').bind('click.' + key, function (event) {
                        if ($(event.target).closest(select).length) return;
                        closeDropdown(select);
                        event.stopPropagation();
                    });
                }

                //click on select
                select_obj.bind('click.select',function (event) {
                    var select = $(this);
                    //if I'm clicking at current
                    if ($(event.target)[0] == current[0]) {
                        if (select.hasClass('opened')) {
                            closeDropdown(select);
                        } else {
                            openDropdown(select);
                        }
                    }

                    //if I'm clicking at option
                    if ($(event.target).hasClass('option')) {
                        var target = $(event.target),
                          text = target.text();
                        if (!target.hasClass('selected')) {
                            //if you click at not selected element
                            var new_value = target.data('value');

                            options.removeClass('selected');
                            target.addClass('selected');
                            current.text(text);
                            select_obj.data('value', new_value);
                            select_obj.trigger('change');
                        }

                        closeDropdown(select);
                    }
                });
            })
        },

        //destroy custom_select plugin at element               (you can remove this method if it don't need)
        destroy : function( ) {
            return this.each(function(){
                var select_obj = $(this);
                select_obj.unbind('.select');
            })
        },
        //set new value in custom_select plugin                 (you can remove this method if it don't need)
        set: function (new_value) {
            return this.each(function(){
                var select_obj = $(this),
                  current = select_obj.find('.select_current'),
                  options = select_obj.find('.option'),
                  value_exist = false;

                $.each(options,function () {
                    if($(this).data('value') == new_value){
                        value_exist = true;
                    }
                });
                if(!value_exist){
                    console.warn('value not found');
                    return;
                }
                if (select_obj.data('value') != new_value) {
                    var selected_option = options.filter('[data-value="' + new_value + '"]');
                    current.text(selected_option.text());
                    options.removeClass('selected');
                    selected_option.addClass('selected');
                    select_obj.trigger('change');
                }
            })
        },
        //add new option into custom_select as html element     (you can remove this method if it don't need)
        add: function (new_option) {
            return this.each(function(){
                var options_container = $(this).find('.select_dropdown'),
                    new_option_tag = '';

                if(new_option.html === undefined){
                    if(new_option.val === undefined){
                        console.warn('value not set');
                        return;
                    }
                    if(new_option.text === undefined){
                        new_option_tag = '<span data-value="'+new_option.val+'" class="option">'+new_option.val+'</span>'
                    } else {
                        new_option_tag = '<span data-value="'+new_option.val+'" class="option">'+new_option.text+'</span>'
                    }
                } else {
                    new_option_tag = new_option.html;
                }
                options_container.append(new_option_tag);
            })
        },
        //remove option by it's value in custom_select plugin   (you can remove this method if it don't need)
        remove: function (rem_value) {
            return this.each(function(){
                var select_obj = $(this),
                    current = select_obj.find('.select_current'),
                    options = select_obj.find('.option');

                var select_val = select_obj.data('value'),
                    selected_option = options.filter('[data-value="' + select_val + '"]'),
                    removed_option = options.filter('[data-value="' + rem_value + '"]');

                if(!removed_option.length){
                    console.warn('option not found');
                    return;
                }

                if(selected_option.data('value') == removed_option.data('value')){
                    removed_option.remove();
                    options = select_obj.find('.option');
                    setDefaultValue()
                } else {
                    removed_option.remove();
                }

                function setDefaultValue() {
                    var first_option = options.eq(0);
                    first_option.addClass('selected');
                    current.text(first_option.text());
                    select_obj.data('value', first_option.data('value'));
                }
            })
        }
    };

    $.fn.customSelect = function (method ) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' not exist in jQuery.customSelect plugin');
        }
    };
})(jQuery);