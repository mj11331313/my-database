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
            if( elem.addEventListener ){
                elem.addEventListener( type , handler );
            }else if( elem.attachEvent ){
                elem.attachEvent( "on" + type , handler );
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
        *
        *cardid：需要验证的身份证号
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
                month = month < 10 ? '0' + month : month;
                var day = date.getDate();
                day = day < 10 ? '0' + day : day;
                return year + month + day;
            }
        };
