        //1.JS深拷贝：
        /*
        * obj：要拷贝的对象名
        * */
        function clone(obj){
            var newObj = {};
            for( var p in obj){
                if( typeof obj[p] == "object"){  //obj的属性值可能是一个对象
                    newObj[p] = clone(obj[p]);   //递归，避免内部浅拷贝
                }else{
                    newObj[p] = obj[p];
                }
            };
            return newObj;
        }

        //2.写入cookie：


        /*
        * expires: 要保存的天数
        * key: 名称
        * value ：要写入的值
        * */
        function addCookie( key , value , expires ){
            var str = key + "=" + value ;
            if( expires != undefined ){
                var date = new Date();
                date.setDate(date.getDate() + expires );
                str += ";expires=" + date.toUTCString();
            }
            document.cookie = str;
        };


        //3.获取cookie值：
        /*
        * key：名称
        * */
        function getCookie(key){
            var cookie = document.cookie.split(";");
            for( var i =0 ; i < cookie.length ; i ++ ){
                var cookies = cookie[i].split("=");
                if( key == cookies[0].trim() ){
                    return cookies[1];
                }
            }
        };
        //4.删除cookie：
        /*
        * key：名称
        * */
        function deleteCookie( key ){
            addCookie(key,"",-100); //重名的cookie会覆盖之前的,expires为负值表示已经过期
        }



        //5.鼠标放上去显示对应内容（tooltip）
        /*
        * selector：选择器
        * */
        function tooltip(selector){
            $(selector).hover(function(e){
                this.tempTitle = $(this).attr("title") ? $(this).attr("title") : $(this).html();
                $("<div class='tooltip'></div>").html(this.tempTitle).offset({
                    left: e.pageX + 10,
                    top: e.pageY + 18
                }).appendTo("body").show("fast");
                $(this).removeAttr("title");
            },function(){
                $(".tooltip").remove();
                $(this).attr("title",this.tempTitle);
            }).on("mousemove",function(e){
                $(".tooltip").offset({
                    left: e.pageX + 10,
                    top: e.pageY + 18
                })
            })
        }



        //6.绑定事件：
        /*
        * elem: 对象
        * type: 事件类型
        * handler: 事件处理函数
        * */
        function addEvent( elem , type , handler ){
            if( elem.addEventListener ){ // 能力检测
                elem.addEventListener( type , handler );
            }else if( elem.attachEvent ){
                // 通过每次调用时都给对象定义不同属性，保证绑定的事件处理函数和删除的是同一个：
                elem[type + handler] = function(){ 
                    handler.call(elem);  // 改变IE中的this指向问题
                };
                elem.attachEvent( "on" + type , elem[type + handler] );
            }else{
                elem[ "on" + type ] = handler;
            }
        }


        //7.根据class查找元素：
        /*
        * className: 要查找的class名称
        * context: 要搜索的范围
        * （返回结果：数组）
        * */
        function getByClass(className, context) {
            context = context || document;
            if (context.getElementsByClassName) {
                return context.getElementsByClassName(className);
            } else {
                var result = [];
                var arr = context.getElementsByTagName('*');
                for (var i = 0; i < arr.length; i++) {
                    //arr[i].className = "aa bb"
                    if (arr[i].className.indexOf(className) != -1) {
                        result.push(arr[i]);
                    }
                }
                return result;
            }
        };



        //8.身份证号验证：
        /*
        * 若返回true,身份证号正确；
        * 返回false,身份证号错误
        * */
        function isIdCard(cardid) {
            //身份证正则表达式(18位)
            var isIdCard2 = /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/i;
            var stard = "10X98765432"; //最后一位身份证的号码
            var first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //1-17系数
            var sum = 0;
            if (!isIdCard2.test(cardid)) {
                return false;
            }
            var year = cardid.substr(6, 4);
            var month = cardid.substr(10, 2);
            var day = cardid.substr(12, 2);
            var birthday = cardid.substr(6, 8);
            if (birthday != dateToString(new Date(year+'/'+month+'/'+day))) {//校验日期是否合法
                return false;
            }
            for (var i = 0; i < cardid.length - 1; i++) {
                sum += cardid[i] * first[i];
            }
            var result = sum % 11;
            var last = stard[result]; //计算出来的最后一位身份证号码
            if(cardid[cardid.length - 1].toUpperCase() == last){
                return true;
            }else{
                return false;
            }
        };
        //日期转字符串 返回日期格式20080808
        function dateToString(date) {
            if (date instanceof Date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = month < 10 ? "0"+ month : month;
                var day = date.getDate();
                day = day < 10 ? "0" + day : day;
                return year + month + day;
            }
        };


        //9.移除事件：
        /*
        * elem: 对象
        * type: 事件类型
        * handler: 事件处理函数
        * */
        function removeEvent(elem , type , handler){
            if( elem.removeEventListener ){
                elem.removeEventListener(type,handler);
            }else if( elem.detachEvent ){
                // elem.fon为调用绑定事件方法时给elem添加的自定义属性，表示其事件处理函数：
                elem.detachEvent( "on" + type, elem[type + handler]);
            }else{
                // 将事件处理函数清空，相当于移除事件：
                elem["on" + type] = null;
            }
        }
        //10.修改或获取一个元素的属性:
        /*
         * 修改或获取一个元素的属性
         * elem: 要修改的元素对象
         * name: 属性名
         * value: 属性值
         */
        function attr(elem, name, value) {
            if ( !name || name.constructor != String ) return '';
            name = { 'for': 'htmlFor', 'class': 'className' }[name] || name;
            if ( value != null ) {
                elem[name] = value;
                if ( elem.setAttribute )
                elem.setAttribute(name,value);
            }
            return elem[name] || elem.getAttribute(name) || '';
        }
        

        //11.修改或获取一个元素的value:
        /*
         * elem: 要修改的元素对象
         * value: value属性的值
         */
        function val(elem, value){
            if(!value) return elem.value || "";
            if(typeof value != "string"  && typeof value != "number" && typeof value != "boolean")
                return "";
            elem.value = value;
        }


        //12.为元素添加class:
        /**
         * elem: 要修改的元素对象
         * className: 要添加的类名
         */
        function addClass(elem, className){
            if(!elem || typeof className != "string")  return;
            if(hasClass(elem, className)) return;
            elem.className = elem.className + " " + className;
        }


        //13.判断元素是否包含指定的class:
        /*
         * elem: 要查找的元素对象
         * className: 要判断的类名
         */
        function hasClass(elem, className){
            var re = new RegExp("\\b" + className + "\\b");
            return re.test(elem.className);
        }


        //14.为元素移除class:
        /*
         * elem: 要修改的元素对象
         * className: 要移除的类名
         */
        function removeClass(elem, className){
            if(!elem || typeof className != "string") return;

            // if(!hasClass(elem, className)) return;
            var re = new RegExp("\\b" + className + "\\b");
            elem.className = trim(elem.className.replace(re, ""));
        }
