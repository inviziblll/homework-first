class Form {
	
	constructor(form, fields) {

		this.form = form;
		this.fields = fields;
		this.email_regexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
		
		this.error_message = "Ваш email или пароль не вырный!";
		this.error_field_value = "не может быть пустым";
		this.error_field_password = "пароль должен содержать не меньше 8 символов";
		this.error_field_email  = "должен быть валиным в формате email";


		this.logout_block = document.getElementById('logout');	
		this.login_block = document.getElementById('login');	
		this.user_block =  document.getElementById('user-block');	
		this.error_block = document.getElementById('error-block');

		this.init();
	}

	init() {
		let self = this;

		this.form.addEventListener("submit", (e) => {
			e.preventDefault();
			
			let error = 0;
			let data = {};
			
			self.fields.forEach((field) => {
				const input = document.querySelector(`#${field}`);
				if (self.fieldHandler(input) == false) {
					error++;
				}else{
					data[input.name] = input.value.trim();
				}
			});

			if (error == 0) {
				this.fetchHandler(data);
			}

		});
	
		
		this.logout_block.addEventListener("click", (e) => {
			self.logout();
		});

	}

	fieldHandler(field) {

		// console.log(field);

		let params = {
			field
		}

		// если поле пустое
		if (field.value.trim() === "") { 

			params.message = `${field.previousElementSibling.innerText} ${this.error_field_value}`;
			params.status = "error";

			this.errorMessage(params);
			return false;
		} 
		
		else { 

			if (field.name == "password") { // если поле пароль
				
				if (field.value.length < 8) {
					
					params.message = `${field.previousElementSibling.innerText} ${this.error_field_password}`;
					params.status = "error";

					this.errorMessage(params);
					return false;
				} 
				else {
					
					params.message = null;
					params.status = "success";

					this.errorMessage(params);
					return true;
				}
			} 

			else if(field.name  == "email") { // если поле email

				if (this.email_regexp.test(field.value.trim())) {
					
					params.message =  null;
					params.status = "success";
					
					this.errorMessage(params);
					return true;

				}
				else {

					params.message = `${field.previousElementSibling.innerText} ${this.error_field_email}`;
					params.status = "error";

					this.errorMessage(params);
					return false;
				}
			}

			else {

				params.message = null;
				params.status = "success";

				this.errorMessage(params);
				return true;
			}
		}

	}

	errorMessage(params) {

		const errorMessage = params.field.parentElement.querySelector(".error-message");
		
		if (params.status == "success") {
			if (errorMessage) {
				errorMessage.innerText = "";
			}
			params.field.classList.remove("input-error");
		}

		if (params.status == "error") {
			errorMessage.innerText = params.message;
			params.field.classList.add("input-error");
		}
	}

	initBlocks(error){

		this.user_block.querySelector('#auth-user-email').innerText =  '';
	
		if(error === true){

			this.error_block.style.display = "block";
			this.error_block.innerText = this.error_message;
			this.user_block.style.display = "none";

		}
		else{
			
			this.error_block.style.display = "none";
			this.logout_block.style.display = "block"; // отрисовываем блок logout
			this.login_block.style.display = "none"; // прячем блок login

			// выводим информацию об авторизованном пользователе
			this.user_block.style.display = "block";
			this.user_block.querySelector('#auth-user-email').innerText = localStorage.getItem("email");	
		}
	
	}

	logout() {
		
		// удаляем информацию из хранилица
		localStorage.removeItem("auth");
		localStorage.removeItem("email");
		
		// прячем блок logout
		this.logout_block.style.display = "none";

		// показываем блок login
		this.login_block.style.display = "block";

		// прячем блок с информацией о авторизованном пользователе
		this.user_block.querySelector('#auth-user-email').innerText = '';
		this.user_block.style.display = "none";


		this.fields.forEach((field) => { // очищаем поля формы
			const input = document.querySelector(`#${field}`);
			input.value = '';
		});
	
	}

	fetchHandler(data){ // ajax-запрос на сервер

		let self = this;
		let url = "https://jsonplaceholder.typicode.com/users"; // сервис для тектирования запросов на бэкенд

		/*fetch(url, { // пример fetch POST запроса на сервер, где находиться PHP файл обработчик
			method:"POST",
			mode: 'cors',
			body:JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
		})*/	

		fetch(url + '?email=' + data.email)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);					
			if(data.length == 0){ // пользователь не найден
				self.initBlocks(true); 
			}
			else{ // пользователь авторизован
				
				let user = data[0];

				localStorage.setItem("email", user.email);
				localStorage.setItem("auth", 1);
				self.initBlocks(false); 
			}

		}) // ошибка при запросе на сервер
		.catch((data) => {
			console.log("Error", data.message)
		});
	}
}

const formBlock = document.getElementById("form-block");
if (formBlock) {
	const fields = ["email", "password"];
	const authForm = new Form(formBlock, fields);
}

 
