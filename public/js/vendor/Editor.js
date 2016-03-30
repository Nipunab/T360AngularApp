function InlineEditorController($scope){
	$scope.showtooltip=false;
	$scope.value='Edit me.';
	
	$scope.toggleTooltip=function(e){
		e.stopPropagation();
		$scope.showtooltip=!$scope.showtooltip;
	}
}
function OrderFormController($scope){
	$scope.services=[
	{
		name:'Web Development',
		price:300,
		active:true
	},
	{
		name:'Design',
		price:400,
		active:false
	},
	{
		name:'Integration',
		price:320,
		active:false
	},
	{
		name:'Training',
		price:450,
		active:false
	}
	];
	$scope.toggleActive=function (t) {
		t.active=!t.active;
	}
	$scope.total=function(){
		var total=0;
		angular.forEach($scope.services,function(s){
			if(s.active){
				total+=s.price;
			}
		});
		return total;
	};
}