import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { SELLER_API_END_POINT } from '@/utils/constants';
import axios from 'axios';


const containerStyle = {
  width: "100%",
  height: "300px"
};

const center = {
  lat: 27.7172, 
  lng: 85.3240
};

const SellerRegister = () => {

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    latitude: null,
    longitude: null
  });

  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const onMapClick = (e) => {
    setInput({
      ...input,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng()
    });
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(`${SELLER_API_END_POINT}/register`, input, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });
      console.log(res.data.success)
      if (res.data.success) {
        navigate("/login");
      }

    } catch (error) {
      console.log(error);
    }

  }

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-greenn)] ">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-[40rem] bg-white shadow-lg rounded-2xl p-6 space-y-5"
      >
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Seller Registration
          </h2>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={changeEventHandler}
            className="input-style p-1"
          />

          <input
            name="email"
            placeholder="Email Address"
            onChange={changeEventHandler}
            className="input-style p-1"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={changeEventHandler}
            className="input-style p-1"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={changeEventHandler}
            className="input-style p-1"
          />

          <input
            name="city"
            placeholder="City"
            onChange={changeEventHandler}
            className="input-style md:col-span-2"
          />
        </div>

        {/* Map Section */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Select Your Location
          </label>

          <div className="overflow-hidden rounded-xl border border-gray-300">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onClick={onMapClick}
            >
              {input.latitude && (
                <Marker
                  position={{
                    lat: input.latitude,
                    lng: input.longitude
                  }}
                />
              )}
            </GoogleMap>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Click on the map to set your location
          </p>
        </div>


        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-300"
        >
          Register Seller
        </button>
      </form>
    </div>

  )
}

export default SellerRegister