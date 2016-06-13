padaApp.controller('purchasesController', ['$scope' ,'restClient', function(scope, restClient) {
	
	scope.totalPrice = 0;	
	scope.editing = false;
	
	//Mercados
	scope.getAllStoresOk = function(response){
		scope.stores = response;
	};
	restClient.sendGetWithoutErrorCallback(scope.getAllStoresOk, '/stores/all');

	//Date picker
	scope.format = 'shortDate';
	scope.options = {
	    showWeeks: false,
	    maxDate: new Date()
	};
	
	//Guardar compra
	scope.save = function(){
		
		data = {
			store : scope.newPurchase.store.id,
			date : scope.newPurchase.date,
			price : scope.newPurchase.price
		};
		restClient.sendPostAsJsonWithoutErrorCallback(scope.getAllOk, data, '/purchase/save');
		scope.clearForm();
	}
	
	//Reset formulario
	scope.clearForm = function(){
		scope.newPurchase.store = null;
		scope.newPurchase.date = null;
		scope.newPurchase.price = null;
	}
	
	//Callback obteniendo las compras
	scope.getAllOk = function(response){
		scope.allPurchases = response;
		
		var price = function(e){return e.price};
		var add = function(x,y){ return x + y};
		var prices = response.map( price );
		scope.totalPrice = prices.reduce(add , 0);
	};
	restClient.sendGetWithoutErrorCallback(scope.getAllOk, '/purchase/all');
	
	//Borrar compra
	scope.remove = function(p){
		restClient.sendPostWithoutErrorCallback(scope.getAllOk, {id: p.id}, '/purchase/delete');
	};	
	
	scope.startEditing = function(p){
		scope.editing = true;
		scope.newPurchase = [];
		scope.newPurchase.price = p.price;
		scope.newPurchase.date = new Date(p.date);
		
		var match = function(store){ return store.id === p.store.id };
		scope.newPurchase.store = scope.stores.filter( match )[0];
	}
	
	scope.cancelEdition = function(){
		scope.editing = false;
		scope.clearForm();
	}
	
}]);	