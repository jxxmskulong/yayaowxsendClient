let util = {

};
util.title = function (title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};
util.dateFormat=function(date){
var a=new Date();
return a;
};
export default util;