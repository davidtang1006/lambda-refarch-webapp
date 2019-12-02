(function() {
	'use strict'

	angular.module('ServerlessBlog')
		.directive('sidenav', sidenav);

	/** @ngInject **/
	function sidenav() {

		var directive = {
			restrict:'E',
			replace:true,
			templateUrl:'app/components/sidenav/sidenav.html',
			controller:SideNavController,
			controllerAs: 'vm',
			bindToController: true
		};

		return directive;

		function SideNavController(
			$scope,
			$log,
			$window,
			$mdSidenav,
			apigService,
			authService,
			toastr ) {

			var vm = this;
				vm.user = {};
				vm.loading = false;
				vm.authenticated = false;
				vm.loading = false;

			$scope.$watch(
		      function() { 
		        return authService.sessionStatus(); 
		      }, 
		      function(authenticated) {
		        vm.authenticated = authenticated;
		        if (authenticated && !vm.user.email) {
		        	vm.user.email = authService.me().email;
		        }
			});
			vm.loghaha = function () {
				$log.error("HaHa")
			}

			vm.close = function() {
				$mdSidenav('right').close();
			};
			vm.myregister = function() {
				vm.loading = true;
				vm.user.email = "admin@admin.com";
				vm.user.password = "admin";
				vm.user.password2 = "admin";
				var params = {
					'email': vm.user.email,
					'password': vm.user.password
				};
				apigService.register(params)
							.then(function(result) {
								$log.debug(result);
								apigService.refresh().then(function() {
									vm.authenticated = true;
									vm.loading = false;
								},function(error) {
									vm.loading = false;
									$log.error(error);
									toastr.error('failed to login');
								});
							},function(error) {
								$log.error(error);
								vm.loading = false;
								vm.authenticated = false;
								toastr.error('A login error occurred, please try logging in with your credentials.');
							});
				apigService.login(vm.user)
						.then(function(result) {
							apigService.refresh().then(function() {
								vm.authenticated = true;
								vm.loading = false;
							},function(error) {
								vm.loading = false;
								$log.error(error);
								toastr.error('failed to login');
							});
						},function(error) {
							vm.loading = false;
							vm.authenticated = false;
							$log.error(error);
							toastr.error('A login error occurred, please try again.');
						});
			}
			vm.mylogin = function () {
				vm.user.email = "admin@admin.com";
				vm.user.password = "admin";
				vm.user.password2 = "admin";
				apigService.login(vm.user)
						.then(function(result) {
							apigService.refresh().then(function() {
								vm.authenticated = true;
								vm.loading = false;
							},function(error) {
								vm.loading = false;
								$log.error(error);
								toastr.error('failed to login');
							});
						},function(error) {
							vm.loading = false;
							vm.authenticated = false;
							$log.error(error);
							toastr.error('A login error occurred, please try again.');
						});
			}
			vm.login = function() {
				vm.loading = true;
				if (vm.register) {
					var params = {
						'email': vm.user.email,
						'password': vm.user.password
					};
					if (params.password !== vm.user.password2) {
						vm.loading = false;
						toastr.error('Passwords do not match');
					} else {
						apigService.register(params)
							.then(function(result) {
								$log.debug(result);
								apigService.refresh().then(function() {
									vm.authenticated = true;
									vm.loading = false;
								},function(error) {
									vm.loading = false;
									$log.error(error);
									toastr.error('failed to login');
								});
							},function(error) {
								$log.error(error);
								vm.loading = false;
								vm.authenticated = false;
								toastr.error('A login error occurred, please try logging in with your credentials.');
							});
					}
				} else {
					apigService.login(vm.user)
						.then(function(result) {
							apigService.refresh().then(function() {
								vm.authenticated = true;
								vm.loading = false;
							},function(error) {
								vm.loading = false;
								$log.error(error);
								toastr.error('failed to login');
							});
						},function(error) {
							vm.loading = false;
							vm.authenticated = false;
							$log.error(error);
							toastr.error('A login error occurred, please try again.');
						});
				}
			};
			vm.logout = function() {
				vm.loading = true;
				authService.logout()
					.then(function() {
						vm.loading = false;
						vm.authenticated = false;
					},function(error) {
						$log.error(error);
					});
					$window.location.replace("https://ec2-3-87-220-96.compute-1.amazonaws.com:8443/auth/realms/webapp/protocol/openid-connect/logout?redirect_uri=http://localhost:3000");
			};
		}
	};
})();