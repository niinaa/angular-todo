angular.module("RouteControllers", []) // TAKE OUT ALERTS AND CONSOLE LOGS
	.controller("HomeController", function($scope) {
		$scope.title = "Welcome to Angular Todo!";
	})

	.controller("RegisterController", function($scope, $location, UserAPIService, store) { 

		$scope.registrationUser = {};
		var URL = "https://morning-castle-91468.herokuapp.com/";

		$scope.login = function() {
			UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results) {
				$scope.token = results.data.token;
				console.log(results.data);
				console.log($scope.token);
				store.set('username', $scope.registrationUser.username);
				store.set('authToken', $scope.token);
			}).catch(function(err) {
				console.log(err.data);
			});
			$location.path("/");
		}

		$scope.submitForm = function() {
			if ($scope.registrationForm.$valid) {
				$scope.registrationUser.username = $scope.user.username;
				$scope.registrationUser.password = $scope.user.password;
				console.log($scope.registrationUser);
			
				UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results) {
					$scope.data = results.data;
					console.log($scope.data);
					alert("You have successfully registered to Angular Todo");
					$scope.login();
				}).catch(function(err) {
					alert("Oops! Something went wrong!");
					console.log(err)
				});
			}
		};
	})

	.controller("LoginController", function($scope, $location, UserAPIService, store) {
		$scope.loginUser = {};
		var URL = "https://morning-castle-91468.herokuapp.com/";

		$scope.submitForm = function() {
			if ($scope.loginForm.$valid) {
				$scope.loginUser.username = $scope.user.username;
				$scope.loginUser.password = $scope.user.password;
				console.log($scope.loginUser);

				UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.loginUser).then(function(results) {
					$scope.token = results.data.token;
					console.log(results.data);
					console.log($scope.token);
					store.set('username', $scope.loginUser.username);
					store.set('authToken', $scope.token);
					alert("You have successfully logged in to Angular Todo");
				}).catch(function(err) {
					console.log(err.data);
				});
				$location.path("/"); // maybe create a redirect page which will go to todo? might refresh
			}
		}
	})
	
	.controller("TodoController", function($scope, $location, TodoAPIService, store) {
		if (!store.get("authToken")) {
			$location.path("/login");
		};

		var URL = "https://morning-castle-91468.herokuapp.com/";

		$scope.authToken = store.get("authToken");
		$scope.username = store.get("username");

		$scope.todos = [];

		TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
			$scope.todos = results.data || [];
			console.log($scope.todos);
		}).catch(function(err) {
			console.log(err)
		});

		$scope.submitForm = function() {
			if ($scope.todoForm.$valid) {
				$scope.todo.username = $scope.username;
				$scope.todos.push($scope.todo);

				TodoAPIService.createTodo(URL + "todo/", $scope.todo, $scope.authToken).then(function(results) {
					//$location.path("/");
					//$location.path("/todo");
					console.log(results);
				}).catch(function(err){
					console.log(err)
				});

			}
		};

		$scope.editTodo = function(id) {
			$location.path("/todo/edit/" + id);
		};

		$scope.deleteTodo = function(id) {
			TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function(results) {
				console.log(results);
			}).catch(function(err) {
				console.log(err);
			});
		};
	})

	.controller("EditTodoController", function($scope, $location, $routeParams, TodoAPIService, store) {
		var id = $routeParams.id;
		var URL = "https://morning-castle-91468.herokuapp.com/";

		TodoAPIService.getTodos(URL + "todo/" + id, $scope.username, store.get("authToken")).then(function(results) {
			$scope.todo = results.data;
		}).catch(function(err) {
			console.log(err)
		});

		$scope.submitForm = function() {
			if ($scope.todoForm.$valid) {
				$scope.todo.username = $scope.username;

				TodoAPIService.editTodo(URL + "todo/" + id, $scope.todo, store.get("authToken")).then(function(results) {
					$location.path("/todo");
				}).catch(function(err) {
					console.log(err);
				})
			}
		} 
	})

	.controller("LogoutController", function($scope, store) {
		store.remove("username");
		store.remove("authToken");
		$scope.logoutmsg = "You have been logged out.";
	});









