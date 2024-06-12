import React, { useState, useEffect } from 'react';

const Customer: React.FC = () => {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("data");
    if (data) {
      setUser(JSON.parse(data));
    } else {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (user) {
      const customerId = localStorage.getItem("customerId");
      if (customerId) {
        fetch(`https://stemprotocol.codefremics.com/api/v2/customers/get-customer-details/${customerId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.access_token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              setCustomer(data.response);
            } else {
              setError("Failed to fetch customer details");
            }
            setLoading(false);
          })
          .catch(() => {
            setError("An error occurred while fetching customer details");
            setLoading(false);
          });
      } else {
        setError("No customer was selected.");
        setLoading(false);
      }
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ color: "red" }}>
      <h1>Customer Profile Page</h1>
      {customer ? (
        <div>
          <p><strong>First Name:</strong> {customer.first_name}</p>
          <p><strong>Other Names:</strong> {customer.other_names}</p>
          <p><strong>Mobile Number:</strong> {customer.mobile}</p>
          <p><strong>Gender:</strong> {customer.gender}</p>
          <p><strong>Email Address:</strong> {customer.email}</p>
        </div>
      ) : (
        <p style={{ color: "white !important" }}>No customer details available.</p>
      )}
    </div>
  );
};

export default Customer;
