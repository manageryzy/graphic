declare module main{
    function doDraw(e:any); 
    function clear();
    function finish();
}

declare module "main" {
	export = main; //...
}