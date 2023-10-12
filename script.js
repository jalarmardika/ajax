const ajax = new XMLHttpRequest()
ajax.onload = function(){
	if (ajax.status === 200) {
		const tBody = document.getElementById('data')
		const {data} = JSON.parse(ajax.response)
		let row = '';
		data.forEach(function(d){
			return row += displayData(d)
		})

		tBody.innerHTML = row
	}else{
		alert(ajax.statusText)
	}
}

ajax.open('get', 'backend/index.php');
ajax.send()

let no = 1;
function displayData(data){
	return `<tr>
				<td>${no++}</td>
				<td>${data.title}</td>
				<td>${data.issued}</td>
				<td>${data.author}</td>
				<td>${data.publisher}</td>
				<td>
					<a href="#" class="edit" data-id="${data.id}">Edit</a>
					<a href="#" class="delete" data-id="${data.id}">Delete</a>
				</td>
			</tr>`;
}

const divForm = document.querySelector('.form')

const linkAdd = document.querySelector('.add')
linkAdd.addEventListener('click', function(e){
	e.preventDefault()
	divForm.innerHTML = `<h5 style="margin-top: 20px;">Add Data</h5>
						<form id="formAdd">
							<label>Title</label>
							<input type="text" name="title">
							<br><br>
							<label>Issued</label>
							<input type="date" name="issued">
							<br><br>
							<label>Author</label>
							<input type="text" name="author">
							<br><br>
							<label>Publisher</label>
							<input type="text" name="publisher">
							<br><br>
							<input type="submit" name="save" value="Save">
							<input type="button" class="close" value="Close">
						</form>`;
})

document.addEventListener('click', function(el){
	if (el.target.classList.contains('edit')) {
		el.preventDefault()
		const id = el.target.dataset.id
		const xhr = new XMLHttpRequest()
		xhr.onload = function(){
			if (xhr.status === 200) {
				const res = JSON.parse(xhr.response)
				console.log(res)
				divForm.innerHTML = `<h5 style="margin-top: 20px;">Edit Data</h5>
									<form id="formEdit" data-id="${res.id}">
										<label>Title</label>
										<input type="text" name="title" value="${res.title}">
										<br><br>
										<label>Issued</label>
										<input type="date" name="issued" value="${res.issued}">
										<br><br>
										<label>Author</label>
										<input type="text" name="author" value="${res.author}">
										<br><br>
										<label>Publisher</label>
										<input type="text" name="publisher" value="${res.publisher}">
										<br><br>
										<input type="submit" name="submit" value="Update">
										<input type="button" class="close" value="Close">
									</form>`;	
			} else{
				alert(xhr.statusText)
			}
		}

		xhr.open('get', 'backend/index.php?id=' + id)
		xhr.send()
	}
})

document.addEventListener('click', function(e){
	if (e.target.classList.contains('close')) {
		divForm.innerHTML = ``;
	}
})

document.addEventListener('submit', function(e){
	if (e.target.id == "formAdd") {
		e.preventDefault()
		const title = e.target.querySelector("input[name=title]").value
		const issued = e.target.querySelector("input[name=issued]").value
		const author = e.target.querySelector("input[name=author]").value
		const publisher = e.target.querySelector("input[name=publisher]").value
		const ajax = new XMLHttpRequest()
		ajax.onload = function(){
			if (ajax.status === 200) {
				const res = JSON.parse(ajax.response)
				alert(res.message)
				window.location.reload()
			}else{
				alert(ajax.statusText)
			}
		}

		ajax.open('post', 'backend/index.php');
		ajax.setRequestHeader("Content-Type", "application/json")
		const data = {title, issued, author, publisher}
		ajax.send(JSON.stringify(data))

	} else if (e.target.id == "formEdit") {
		e.preventDefault()
		const id = e.target.dataset.id
		const title = e.target.querySelector("input[name=title]").value
		const issued = e.target.querySelector("input[name=issued]").value
		const author = e.target.querySelector("input[name=author]").value
		const publisher = e.target.querySelector("input[name=publisher]").value
		const ajax = new XMLHttpRequest()
		ajax.onload = function(){
			if (ajax.status === 200) {
				const res = JSON.parse(ajax.response)
				alert(res.message)
				window.location.reload()
			}else{
				alert(ajax.statusText)
			}
		}

		ajax.open('put', 'backend/index.php?id=' + id);
		ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		const data = new URLSearchParams()
		data.append("title", title)
		data.append("issued", issued)
		data.append("author", author)
		data.append("publisher", publisher)

		ajax.send(data)
	} 
})

document.addEventListener('click', function(e){
	if (e.target.classList.contains('delete')) {
		e.preventDefault()
		const id = e.target.dataset.id
		const request = new XMLHttpRequest()
		request.onload = function(){
			if (request.status === 200) {
				const response = JSON.parse(request.response)
				alert(response.message)
				window.location.reload()
			} else{
				alert(request.statusText)
			}
		}

		request.open('delete', 'backend/index.php?id=' + id)
		request.send()
	}
})