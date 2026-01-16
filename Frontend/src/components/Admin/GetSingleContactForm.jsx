import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GetSingleContactForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/contact/${id}`,
          { withCredentials: true }
        );

        setContact(res.data.data);

        // mark as read
        await axios.patch(
          `http://localhost:8000/api/v1/contact/read/${id}`,
          {},
          { withCredentials: true }
        );

      } catch (err) {
        setError("Failed to load contact");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Contact Details</h2>

      <div className="space-y-2">
        <p><strong>Name:</strong> {contact.name}</p>
        <p><strong>Email:</strong> {contact.email}</p>
        <p><strong>Phone:</strong> {contact.phone}</p>
        <p><strong>Subject:</strong> {contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p className="bg-gray-100 p-3 rounded">{contact.message}</p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Go Back
      </button>
    </div>
  );
};

export default GetSingleContactForm;
