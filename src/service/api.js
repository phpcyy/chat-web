import 'whatwg-fetch'

let api = fetch;
api.post = function (uri, data) {
    console.log(uri)
    return fetch('http://api.scrm.weisgj.com/user/get_token', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        mode: "cors",
        body: "email=phpcyy@163.com&password=654321"
    })
}


export default api