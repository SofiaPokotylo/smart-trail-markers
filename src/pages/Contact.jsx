import React from 'react'
const Contact = () => {
return (
<div className="container contact">
    <div className="row">
        <div className="col-md-8 col-12 mx-auto">
            <div className="card shadow-lg border-0 p-4">
                <h1 className="text-center bg-dark text-white display-4 d-inline-block">Зв'яжіться з нами</h1>
                <div className="form-group my-5">
                    <div className="row">
                        <div className="col-md-4 col-12 mx-auto my-2">
                            <input type="text" className="form-control-lg" placeholder="Ім'я" required />
                        </div>
                        <div className="col-md-5 col-12 mx-auto my-2">
                            <input type="text" className="form-control-lg" placeholder="Прізвище" required />
                        </div>
                    </div>
                </div>
                <div className="form-group mb-5">
                    <div className="row">
                        <div className="col-md-4 col-12 mx-auto my-2">
                            <input type="email" className="form-control-lg" placeholder="Email" required />
                        </div>
                        <div className="col-md-5 col-12 mx-auto my-2">
                            <input type="tel" className="form-control-lg" placeholder="Номер телефону" required />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="mt-4 col-md-11 col-12 mx-auto">
                        <textarea className="form-control" row="20" placeholder="Ваше повідомлення" required></textarea>
                    </div>
                </div>
                <div className="mt-5 col-md-6 col-12 mx-auto">
                    <button className="btn btn-outline-dark btn-lg btn-block">Надіслати</button>
                </div>
            </div>
        </div>
    </div>
</div>
)
}
export default Contact