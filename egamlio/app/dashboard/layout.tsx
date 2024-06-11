"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    const path = usePathname();
    const data = localStorage.getItem("data");
    const user = data ? JSON.parse(data) : null;
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        other_names: '',
        gender: '',
        mobile_number: '',
        email: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    if (!data) {
        window.location.href = "/login";
    }

    const handleLogout = () => {
        localStorage.removeItem("data");
        window.location.href = "/login"; // >>
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.first_name) errors.first_name = "First name is required";
        if (!formData.other_names) errors.other_names = "Other names are required";
        if (!formData.gender) errors.gender = "Gender is required";
        if (!formData.mobile_number) {
            errors.mobile_number = "Mobile number is required";
        } else if (!/^\d+$/.test(formData.mobile_number)) {
            errors.mobile_number = "Mobile number must contain only digits";
        }
                if (!formData.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email address is invalid";
        }
        if (!formData.description) errors.description = "Description is required";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        // console.log(user.access_token)
        // console.log(formData)

        try {    
            
            setError("");
            setSuccess("");
            const response = await fetch("https://stemprotocol.codefremics.com/api/v2/customers/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.access_token}`
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (result.status === 200) {

                setSuccess(`${result.description}`);
                setTimeout(() => {
                    setShowModal(false);
                  }, 12000);
                                  setFormData({
                    first_name: '',
                    other_names: '',
                    gender: '',
                    mobile_number: '',
                    email: '',
                    description: ''
                });
            } else {
                // console.error(result)
                setError(`Sorry, You couldn't add a customer because ${result.msg}. Please try again!`);
            }
        } catch (error) {
            alert("An error occurred: " + error.message);
        }
    };

    return (
        <>
            <section className="banner-section inner-banner coach dashboard">
                <div className="overlay">
                    <div className="banner-content">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 col-md-10">
                                    <div className="main-content">
                                        <h2>User Dashboard</h2>
                                        <div className="breadcrumb-area">
                                            <nav aria-label="breadcrumb">
                                                <ol className="breadcrumb d-flex align-items-center">
                                                    <li className="breadcrumb-item"><Link href="index">Home</Link></li>
                                                    <li className="breadcrumb-item"><Link href="#">Pages</Link></li>
                                                    <li className="breadcrumb-item active" aria-current="page">User Dashboard</li>
                                                </ol>
                                            </nav>
                                        </div>
                                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Register New Customer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="overlay pb-120">
                    <div className="container">
                        <div className="row">
                            <div className="col-xxl-3 col-lg-4 col-md-8">
                                <div className="sidebar-single">
                                    <div className="profile-img">
                                        <img src="/images/author-profile-4.png" alt="icon" />
                                    </div>
                                    <h5>{user.firstName +" "+ user.lastName}</h5>
                                    <Link href="#" className="cmn-btn alt" onClick={handleLogout}>Logout</Link>
                                </div>
                                <div className="sidebar-single">
                                    <ul>
                                        <li>
                                            <Link href="/dashboard" className={`${path === '/dashboard' && 'active'}`}>
                                                <img src="/images/icon/dashboard-menu-1.png" className="max-un" alt="icon" />
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/dashboard/orders" className={`${path === '/dashboard/orders' && 'active'}`}>
                                                <img src="/images/icon/dashboard-menu-2.png" className="max-un" alt="icon" />
                                                My orders
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/dashboard/personal-info" className={`${path === '/dashboard/personal-info' && 'active'}`}>
                                                <img src="/images/icon/dashboard-menu-3.png" className="max-un" alt="icon" />
                                                Personal Information
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/dashboard/invoices" className={`${path === '/dashboard/invoices' && 'active'}`}>
                                                <img src="/images/icon/dashboard-menu-4.png" className="max-un" alt="icon" />
                                                My Invoices
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/dashboard/payment" className={`${path === '/dashboard/payment' && 'active'}`}>
                                                <img src="/images/icon/dashboard-menu-2.png" className="max-un" alt="icon" />
                                                Payment method
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/dashboard/password" className={`${path === '/dashboard/password' && 'active'}`}>
                                                <img src="/images/icon/dashboard-menu-6.png" className="max-un" alt="icon" />
                                                Change password
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="sidebar-single">
                                    <div className="profile-img">
                                        <img src="/images/icon/help-icon.png" alt="icon" />
                                    </div>
                                    <h5>Do you need help</h5>
                                    <p>Just let us know how we can help you and we will try to find a solution as soon as possible.</p>
                                    <Link href="contact" className="cmn-btn mt-4">Chat with Us</Link>
                                </div>
                            </div>
                            <div className="col-xxl-9 col-lg-8 cus-mar">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showModal && (
                <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content"style={{  backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-header">
                                <h5 className="modal-title">Register New Customer</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    X
                                </button>
                            </div>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            {success && <p style={{ color: "green", fontWeight: 1000 }}>{success}</p>}
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="first_name">First Name</label>
                                        <input type="text" className="form-control" id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} />
                                        {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="other_names">Other Names</label>
                                        <input type="text" className="form-control" id="other_names" name="other_names" value={formData.other_names} onChange={handleInputChange} />
                                        {errors.other_names && <div className="text-danger">{errors.other_names}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="gender">Gender</label>
                                        <select className="form-control" id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        {errors.gender && <div className="text-danger">{errors.gender}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="mobile_number">Mobile Number</label>
                                        <input type="text" className="form-control" id="mobile_number" name="mobile_number" value={formData.mobile_number} onChange={handleInputChange} />
                                        {errors.mobile_number && <div className="text-danger">{errors.mobile_number}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} />
                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleInputChange} />
                                        {errors.description && <div className="text-danger">{errors.description}</div>}
                                    </div>
                                        <hr></hr>
                                        <nav className="navbar">
                                        <div className="container d-flex justify-content-end">
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </div>
                                        </nav>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
