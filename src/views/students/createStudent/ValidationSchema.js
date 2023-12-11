import React from 'react'
import * as Yup from 'yup';
import moment from 'moment/moment';
//let date = new date()
export default function ValidationSchema() {
    return Yup.object().shape({
        firstName : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("First Name is required"),
        lastName  : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("Last Name is required"),
        birthDate : Yup.string().required("Birth Date is required").test(
          "DOB",
          "Age must be at least 5 years",
          (date) => moment().diff(moment(date), "years") > 5
        ),
        gender    : Yup.object().required("Gender is required"),
        address   : Yup.string().required("Address is required"),
         city     : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("City is required"),
        state     : Yup.object().required("State is required"),
        zipcode   : Yup.string().min(5, 'Must be exactly 5 digits').max(5, 'Must be exactly 5 digits').required("Zipcode is required"),
        gfirstName: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("First Name is required"),
        glastName : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("Last Name is required"),
        gaddress  : Yup.string().required("Address is required"),
         gcity    : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("City is required"),
        gstate    : Yup.object().required("State is required"),
        gzipcode  : Yup.string().min(5, 'Must be exactly 5 digits').max(5, 'Must be exactly 5 digits').required("Zipcode is required"),
        email     : Yup.string().required("Email is required").email("Invalid mail address"),
        phone     : Yup.string().min(10, 'Minimum 10 digits!').max(14, 'Maximum 14 digits!').required("Phone is required"),  
        sports    : Yup.object().required("Sports is required"), 
        batch     : Yup.object().required("Batch is required"),
        programName        : Yup.object().required("Program Name is required"),
        contractImageName   : Yup.string().required("Contract Upload is required"),
        contractNameSelect : Yup.object().required("Contract is required"),
        member    : Yup.object().required("Member is required"),
        memberFrequency    : Yup.object().required("Frequency is required"),
      });
}
