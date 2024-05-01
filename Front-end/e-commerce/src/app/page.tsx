"use client";
import styles from "./page.module.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.css";
import { useRouter } from "next/navigation";
import "./globals.css";
import bcrypt from "bcryptjs";
import { Kenia, Lilita_One } from "next/font/google";
import OtpInput, { AllowedInputTypes } from "react-otp-input";
import { Lexend } from "next/font/google";
import DOMPurify from "dompurify";
import { TCountries, countries } from "countries-list";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCcMastercard } from "react-icons/fa";
import { FaPaypal } from "react-icons/fa";
import { TbBrandVisa } from "react-icons/tb";
import { CiLock } from "react-icons/ci";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface Countries {
  [key: string]: {
    capital: String;
    continent: String;
    currency: String;
    languages: String;
    name: String;
    native: String;
    phone: number;
  };
}

interface DataAcc {
  _id: string;
  username: string;
  email: string;
  password: string;
  personalInfo: {
    name: string;
    adress: string;
    phonenumber: string;
  };
  verificationCode: string;
  isActive: boolean;
  __v: 0;
}

export const uri = "http://localhost:3002";

const lexend = Lexend({ subsets: ["latin"], weight: "600" });
const lilita = Lilita_One({ subsets: ["latin"], weight: "400" });
const kenia = Kenia({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const navg = useRouter();

  const abtrf = useRef<HTMLElement>(null);
  const cntcrf = useRef<HTMLElement>(null);
  const prdrf = useRef<HTMLElement>(null);
  const [opnpinfo, setOpnpinfo] = useState(false);
  const [vrfinpt, setVrfInpt] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [txtrslt, setTxtrslt] = useState("");
  const [lgnrgsop, setLgnrgsop] = useState<boolean>(false);
  const [lmt, setLmt] = useState(6);
  const [cpnumber, setCpnumber] = useState("");
  const [tovrfc, setToVrfc] = useState(false);
  const [chckoutcode, setCheckoutcode] = useState(`<div class="iphone">
	<header class="header">
		<h1 className="${lexend.className}">Checkout</h1>
	</header>
	
	<form action="https://httpbin.org/post" class="form" method="POST">
		<div>
		<h2>Address</h2>
	
		<div class="card">
			<address>
			Adam Johnson<br />
			403 Oakland Ave Street, A city, Florida, 32104,<br />
			United States of America
			</address>
		</div>
		</div>
	
		<fieldset>
		<legend>Payment Method</legend>
	
		<div class="form__radios">
			<div class="form__radio">
			<label for="visa"><TbBrandVisa />Visa Payment</label>
			<input checked id="visa" name="payment-method" type="radio" />
			</div>
	
			<div class="form__radio">
			<label for="paypal"><FaPaypal />PayPal</label>
			<input id="paypal" name="payment-method" type="radio" />
			</div>
	
			<div class="form__radio">
			<label for="mastercard"><FaCcMastercard />Master Card</label>
			<input id="mastercard" name="payment-method" type="radio" />
			</div>
		</div>
		</fieldset>
	
		<div>
		<h2>Shopping Bill</h2>
	
		<table>
			<tbody>
			<tr>
				<td>Shipping fee</td>
			</tr>
			<tr>
				<td>Discount 10%</td>
				<td align="right">-$0</td>
			</tr>
			<tr>
				<td>Price Total</td>
				<td align="right">$0</td>
			</tr>
			</tbody>
			<tfoot>
			<tr>
				<td>Total</td>
				<td align="right">$0</td>
			</tr>
			</tfoot>
		</table>
		</div>
	
		<div>
		<button class="button button--full" type="submit">
		<CiLock />Buy Now</button>
		</div>
	</form>
	</div>`);
  const [opnbuy, setOpnbuy] = useState(false);
  const [islogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [repass, setRepass] = useState("");
  const [vrfc, setVrfc] = useState("");
  const [opnoption, setOpnoption] = useState(false);
  const [rgstrespon, setRgstrespon] = useState("");
  const [submitstt, setSubmitstt] = useState(false);
  const [products, setProducts] = useState<Array<Product>>([]);

  const [adress, setAdress] = useState(
    localStorage.getItem("adress")?.split("+") || ["", "", "", "", ""]
  );
  const [pnumber, setPnumber] = useState<string | undefined>(
    localStorage.getItem("pnumber") || ""
  );
  const [fname, setFname] = useState<string>(
    localStorage.getItem("name")?.split(" ")[0] || ""
  );
  const [lname, setLname] = useState<string>(
    localStorage.getItem("name")?.split(" ")[1] || ""
  );

  const [isLogged, setIsLogged] = useState(false);

  const seeIsLogged = async () => {
    const d = await bcrypt.compare(
      "true",
      localStorage.getItem("islogin") || ""
    );
    console.log(d);
    if (d) {
      setIsLogged(d);
    }
  };

  useEffect(() => {
    seeIsLogged();
  }, []);

  const Submit = () => {
    setUsername(username.replace(/\s/g, ""));
    setPass(pass.replace(/\s/g, ""));
    setRepass(repass.replace(/\s/g, ""));
    setEmail(email.replace(/\s/g, ""));
    if (islogin == false) {
      if (submitstt)
        axios({
          method: "post",
          url: `${uri}/register`,
          data: {
            email: email,
            password: pass,
            username: username,
          },
        }).then((r) => {
          if (r.data.includes("verification code is")) {
            const ac = r.data.slice(22, r.data.length);
            let t = "";
            const chrs = [
              "0",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "a",
              "b",
              "c",
              "d",
              "e",
              "f",
              "g",
              "h",
              "i",
              "j",
              "k",
              "l",
              "m",
              "n",
              "o",
              "p",
              "q",
              "r",
              "s",
              "t",
              "u",
              "v",
              "w",
              "x",
              "y",
              "z",
            ];
            for (let i = 0; i < 5; i++) {
              t += chrs[chrs.length - chrs.indexOf(ac[i]) - 1];
            }
            toast("account created successfully");
            toast("verify your account");
            setVrfc(t);
            setToVrfc(true);
          } else {
            toast.error(r.data);
          }
        });
    } else {
      if (submitstt) {
        axios
          .post(`${uri}/login`, {
            email: email,
            password: pass,
          })
          .then((r) => {
            if (r.status == 222) {
              const dtr: DataAcc = r.data;
              toast(`Hello ${dtr.username}`);
              setIsLogged(true);
              setLgnrgsop(false);
              setToVrfc(false);
              const hshdTr = bcrypt.hashSync("true");
              localStorage.setItem("islogin", hshdTr);
              localStorage.setItem("username", dtr.username);
              localStorage.setItem("email", email);
              localStorage.setItem("adress", dtr.personalInfo.adress);
              localStorage.setItem("pnumber", dtr.personalInfo.phonenumber);
              setFname(dtr.personalInfo.name.split(" ")[0]);
              setLname(dtr.personalInfo.name.split(" ")[1]);
              setAdress([
                dtr.personalInfo.adress.split("+")[0],
                dtr.personalInfo.adress.split("+")[1],
                dtr.personalInfo.adress.split("+")[2],
                dtr.personalInfo.adress.split("+")[3],
              ]);
              setPnumber(dtr.personalInfo.phonenumber.toString());
              localStorage.setItem("name", dtr.personalInfo.name);
            } else if (r.data.includes("verification code is")) {
              const ac = r.data.slice(22, r.data.length);
              let t = "";
              const chrs = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
              ];
              for (let i = 0; i < 5; i++) {
                t += chrs[chrs.length - chrs.indexOf(ac[i]) - 1];
              }
              setVrfc(t);
              setToVrfc(true);
            } else {
              toast.error(r.data);
            }
          });
      }
    }
  };

  const getData = async () => {
    await axios
      .get("https://fakestoreapi.com/products")
      .then((r) => {
        const valr: Array<Product> = r.data;
        setProducts(valr);
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const detecteisvalid = () => {};

  const CheckedVrfc = async () => {
    if (vrfinpt.length == 5) {
      if (vrfc == vrfinpt) {
        toast("Hello");
        setToVrfc(false);
        setIsLogin(true);
        axios.get(`${uri}/setactive/${email}`).catch((e) => {
          console.log(e);
        });
      } else {
        setVrfInpt("");
        toast.error("this not a valid verification code");
      }
    }
  };

  const SubmitPinfo = async () => {
    const eml = localStorage.getItem("email") || "";
    let ads = "";
    adress.map((v, i) => {
      const x = i;
      if (x != adress.length) {
        ads += v + "+";
      } else {
        ads += v;
      }
    });
    const sv = fname.replace(" ", "") + " " + lname.replace(" ", "");

    await axios
      .post(`${uri}/sbmtpinfo/${eml}`, {
        name: sv,
        adress: ads,
        phonenumber: pnumber,
      })
      .then((r) => {
        if (r.status == 201) {
          toast("Submit Successfully");
          localStorage.setItem("adress", ads);
          localStorage.setItem("pnumber", pnumber || "");
          localStorage.setItem("name", sv);
        }
      });
  };

  useEffect(() => {
    CheckedVrfc();
  }, [vrfinpt]);

  const Changelgn = () => {
    if (lgnrgsop) {
      setLgnrgsop(false);
    }
    if (opnbuy) {
      setOpnbuy(false);
    }
    if (opnpinfo) {
      setOpnpinfo(false);
    }
  };

  useEffect(() => {
    console.log(adress);
  }, [adress]);

  useEffect(() => {
    if (islogin == false) {
      if (
        username!.length >= 3 &&
        pass.length >= 8 &&
        pass == repass &&
        email.includes("@")
      ) {
        setSubmitstt(true);
      } else {
        setSubmitstt(false);
      }
    } else {
      if (email.includes("@") && pass.length >= 8) {
        setSubmitstt(true);
      } else {
        setSubmitstt(false);
      }
    }
  }, [username, pass, repass, email]);

  useEffect(() => {
    setCheckoutcode(`<div class="iphone">
		<header class="header">
			<h1 className="${lexend.className}">Checkout</h1>
		</header>
		
		<form action="https://httpbin.org/post" class="form" method="POST">
			<div>
			<h2>Address</h2>
		
			<div class="card">
				<address>
				${lname + " " + fname}<br />
				${adress[0]}<br />
				${adress[1]}
				</address>
			</div>
			</div>
		
			<fieldset>
			<legend>Payment Method</legend>
		
			<div class="form__radios">
				<div class="form__radio">
				<label for="visa"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 15l-1 -6l-2.5 6"></path><path d="M9 15l1 -6"></path><path d="M3 9h1v6h.5l2.5 -6"></path><path d="M16 9.5a.5 .5 0 0 0 -.5 -.5h-.75c-.721 0 -1.337 .521 -1.455 1.233l-.09 .534a1.059 1.059 0 0 0 1.045 1.233a1.059 1.059 0 0 1 1.045 1.233l-.09 .534a1.476 1.476 0 0 1 -1.455 1.233h-.75a.5 .5 0 0 1 -.5 -.5"></path><path d="M18 14h2.7"></path></svg>Visa Payment</label>
				<input checked id="visa" name="payment-method" type="radio" />
				</div>
		
				<div class="form__radio">
				<label for="paypal"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"></path></svg>PayPal</label>
				<input id="paypal" name="payment-method" type="radio" />
				</div>
		
				<div class="form__radio">
				<label for="mastercard"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M482.9 410.3c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.6 0 11.2 5.2 11.2 11.7zm-310.8-11.7c-7.1 0-11.2 5.2-11.2 11.7 0 6.5 4.1 11.7 11.2 11.7 6.5 0 10.9-4.9 10.9-11.7-.1-6.5-4.4-11.7-10.9-11.7zm117.5-.3c-5.4 0-8.7 3.5-9.5 8.7h19.1c-.9-5.7-4.4-8.7-9.6-8.7zm107.8.3c-6.8 0-10.9 5.2-10.9 11.7 0 6.5 4.1 11.7 10.9 11.7 6.8 0 11.2-4.9 11.2-11.7 0-6.5-4.4-11.7-11.2-11.7zm105.9 26.1c0 .3.3.5.3 1.1 0 .3-.3.5-.3 1.1-.3.3-.3.5-.5.8-.3.3-.5.5-1.1.5-.3.3-.5.3-1.1.3-.3 0-.5 0-1.1-.3-.3 0-.5-.3-.8-.5-.3-.3-.5-.5-.5-.8-.3-.5-.3-.8-.3-1.1 0-.5 0-.8.3-1.1 0-.5.3-.8.5-1.1.3-.3.5-.3.8-.5.5-.3.8-.3 1.1-.3.5 0 .8 0 1.1.3.5.3.8.3 1.1.5s.2.6.5 1.1zm-2.2 1.4c.5 0 .5-.3.8-.3.3-.3.3-.5.3-.8 0-.3 0-.5-.3-.8-.3 0-.5-.3-1.1-.3h-1.6v3.5h.8V426h.3l1.1 1.4h.8l-1.1-1.3zM576 81v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V81c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM64 220.6c0 76.5 62.1 138.5 138.5 138.5 27.2 0 53.9-8.2 76.5-23.1-72.9-59.3-72.4-171.2 0-230.5-22.6-15-49.3-23.1-76.5-23.1-76.4-.1-138.5 62-138.5 138.2zm224 108.8c70.5-55 70.2-162.2 0-217.5-70.2 55.3-70.5 162.6 0 217.5zm-142.3 76.3c0-8.7-5.7-14.4-14.7-14.7-4.6 0-9.5 1.4-12.8 6.5-2.4-4.1-6.5-6.5-12.2-6.5-3.8 0-7.6 1.4-10.6 5.4V392h-8.2v36.7h8.2c0-18.9-2.5-30.2 9-30.2 10.2 0 8.2 10.2 8.2 30.2h7.9c0-18.3-2.5-30.2 9-30.2 10.2 0 8.2 10 8.2 30.2h8.2v-23zm44.9-13.7h-7.9v4.4c-2.7-3.3-6.5-5.4-11.7-5.4-10.3 0-18.2 8.2-18.2 19.3 0 11.2 7.9 19.3 18.2 19.3 5.2 0 9-1.9 11.7-5.4v4.6h7.9V392zm40.5 25.6c0-15-22.9-8.2-22.9-15.2 0-5.7 11.9-4.8 18.5-1.1l3.3-6.5c-9.4-6.1-30.2-6-30.2 8.2 0 14.3 22.9 8.3 22.9 15 0 6.3-13.5 5.8-20.7.8l-3.5 6.3c11.2 7.6 32.6 6 32.6-7.5zm35.4 9.3l-2.2-6.8c-3.8 2.1-12.2 4.4-12.2-4.1v-16.6h13.1V392h-13.1v-11.2h-8.2V392h-7.6v7.3h7.6V416c0 17.6 17.3 14.4 22.6 10.9zm13.3-13.4h27.5c0-16.2-7.4-22.6-17.4-22.6-10.6 0-18.2 7.9-18.2 19.3 0 20.5 22.6 23.9 33.8 14.2l-3.8-6c-7.8 6.4-19.6 5.8-21.9-4.9zm59.1-21.5c-4.6-2-11.6-1.8-15.2 4.4V392h-8.2v36.7h8.2V408c0-11.6 9.5-10.1 12.8-8.4l2.4-7.6zm10.6 18.3c0-11.4 11.6-15.1 20.7-8.4l3.8-6.5c-11.6-9.1-32.7-4.1-32.7 15 0 19.8 22.4 23.8 32.7 15l-3.8-6.5c-9.2 6.5-20.7 2.6-20.7-8.6zm66.7-18.3H408v4.4c-8.3-11-29.9-4.8-29.9 13.9 0 19.2 22.4 24.7 29.9 13.9v4.6h8.2V392zm33.7 0c-2.4-1.2-11-2.9-15.2 4.4V392h-7.9v36.7h7.9V408c0-11 9-10.3 12.8-8.4l2.4-7.6zm40.3-14.9h-7.9v19.3c-8.2-10.9-29.9-5.1-29.9 13.9 0 19.4 22.5 24.6 29.9 13.9v4.6h7.9v-51.7zm7.6-75.1v4.6h.8V302h1.9v-.8h-4.6v.8h1.9zm6.6 123.8c0-.5 0-1.1-.3-1.6-.3-.3-.5-.8-.8-1.1-.3-.3-.8-.5-1.1-.8-.5 0-1.1-.3-1.6-.3-.3 0-.8.3-1.4.3-.5.3-.8.5-1.1.8-.5.3-.8.8-.8 1.1-.3.5-.3 1.1-.3 1.6 0 .3 0 .8.3 1.4 0 .3.3.8.8 1.1.3.3.5.5 1.1.8.5.3 1.1.3 1.4.3.5 0 1.1 0 1.6-.3.3-.3.8-.5 1.1-.8.3-.3.5-.8.8-1.1.3-.6.3-1.1.3-1.4zm3.2-124.7h-1.4l-1.6 3.5-1.6-3.5h-1.4v5.4h.8v-4.1l1.6 3.5h1.1l1.4-3.5v4.1h1.1v-5.4zm4.4-80.5c0-76.2-62.1-138.3-138.5-138.3-27.2 0-53.9 8.2-76.5 23.1 72.1 59.3 73.2 171.5 0 230.5 22.6 15 49.5 23.1 76.5 23.1 76.4.1 138.5-61.9 138.5-138.4z"></path></svg>Master Card</label>
				<input id="mastercard" name="payment-method" type="radio" />
				</div>
			</div>
			</fieldset>
		
			<div>
			<h2>Shopping Bill</h2>
		
			<table>
				<tbody>
				<tr>
					<td>Shipping fee</td>
					<td align="right">$${(price * 0.05)
            .toString()
            .slice(
              0,
              Math.min(
                (price * 0.05).toString().length,
                (price * 0.05).toString().indexOf(".") + 4
              )
            )}</td>
				</tr>
				<tr>
					<td>Discount 10%</td>
					<td align="right">-$${(price * 0.1)
            .toString()
            .slice(
              0,
              Math.min(
                (price * 0.05).toString().length,
                (price * 0.1).toString().indexOf(".") + 4
              )
            )}</td>
				</tr>
				<tr>
					<td>Price Total</td>
					<td align="right">$${price}</td>
				</tr>
				</tbody>
				<tfoot>
				<tr>
					<td>Total</td>
					<td align="right">$${(price * 0.05 + price * 0.1 + price)
            .toString()
            .slice(
              0,
              (price * 0.05 - price * 0.1 + price).toString().indexOf(".") + 4
            )}</td>
				</tr>
				</tfoot>
			</table>
			</div>
		
			<div>
			<button class="button button--full" type="submit">
			<CiLock />Buy Now</button>
			</div>
		</form>
		</div>`);
  }, [price]);

  useEffect(() => {
    console.log("this ==> " + opnbuy);
  }, [opnbuy]);

  return (
    <div
      onClick={() => {
        if (opnoption == true) {
          setOpnoption(false);
        }
      }}
    >
      <div
        onClick={() => {
          Changelgn();
        }}
        className="hero_area"
      >
        {/* <!-- header section strats --> */}
        <header className="header_section long_section px-0">
          <nav className="navbar navbar-expand-lg custom_nav-container ">
            <a className="navbar-brand" href="">
              <span>PROXD</span>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className=""> </span>
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <div className="d-flex mx-auto flex-column flex-lg-row align-items-center">
                <ul className="navbar-nav  ">
                  <li className="nav-item active">
                    <a
                      style={{ cursor: "pointer" }}
                      className="nav-link"
                      onClick={() => {
                        navg.push("./");
                      }}
                    >
                      Home <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      style={{ cursor: "pointer" }}
                      className="nav-link"
                      onClick={() => {
                        if (abtrf && abtrf.current) {
                          abtrf.current.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                    >
                      {" "}
                      About
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      style={{ cursor: "pointer" }}
                      className="nav-link"
                      onClick={() => {
                        if (prdrf && prdrf.current /* + other conditions */) {
                          prdrf.current.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                    >
                      Products
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      style={{ cursor: "pointer" }}
                      className="nav-link"
                      onClick={() => {
                        if (cntcrf && cntcrf.current /* + other conditions */) {
                          cntcrf.current.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
              <div className="quote_btn-container">
                <a
                  style={{ cursor: "pointer", textTransform: "none" }}
                  onClick={() => {
                    if (!isLogged) {
                      setLgnrgsop(true);
                    } else {
                      setOpnoption(true);
                    }
                  }}
                >
                  <span>
                    {isLogged
                      ? "Hello, " + localStorage.getItem("username")
                      : "LOGIN"}
                  </span>
                  <i
                    style={{ marginLeft: isLogged ? "10px" : "" }}
                    className={`fa ${isLogged ? "fa-cog" : "fa-user"}`}
                    aria-hidden="true"
                  ></i>
                </a>
                {opnoption ? (
                  <div className="optionstg">
                    <ul>
                      <li
                        onClick={() => {
                          setOpnpinfo(true);
                        }}
                        className="otn"
                      >
                        personal information
                      </li>
                      <span className="lnse"></span>
                      <li
                        onClick={() => {
                          localStorage.setItem("islogin", "");
                          localStorage.setItem("username", "");
                          window.location.reload();
                        }}
                        className="otn"
                      >
                        Log Out
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </nav>
        </header>
        {/* <!-- end header section -->
    <!-- slider section --> */}
        <section className="slider_section long_section">
          <div
            id="customCarousel"
            className="carousel slide"
            data-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="container ">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="detail-box">
                        <h1>
                          For All Your <br></br>
                          Product Needs
                        </h1>
                        <p>
                          Lorem ipsum, dolor sit amet consectetur adipisicing
                          elit. Minus quidem maiores perspiciatis, illo maxime
                          voluptatem a itaque suscipit.
                        </p>
                        <div className="btn-box">
                          <a
                            onClick={() => {
                              if (
                                cntcrf &&
                                cntcrf.current /* + other conditions */
                              ) {
                                cntcrf.current.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              }
                            }}
                            className="btn1"
                          >
                            Contact Us
                          </a>
                          <a
                            onClick={() => {
                              if (
                                abtrf &&
                                abtrf.current /* + other conditions */
                              ) {
                                abtrf.current.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              }
                            }}
                            className="btn2"
                          >
                            About Us
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div
                        style={{ backgroundColor: "#f9fafa" }}
                        className="img-box"
                      >
                        <img src="images/slider-img.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="container ">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="detail-box">
                        <h1>
                          For All Your <br></br>
                          Product Needs
                        </h1>
                        <p>
                          Lorem ipsum, dolor sit amet consectetur adipisicing
                          elit. Minus quidem maiores perspiciatis, illo maxime
                          voluptatem a itaque suscipit.
                        </p>
                        <div className="btn-box">
                          <a href="" className="btn1">
                            Contact Us
                          </a>
                          <a href="" className="btn2">
                            About Us
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="img-box">
                        <img src="images/slider-img.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="container ">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="detail-box">
                        <h1>
                          For All Your <br></br>
                          Product Needs
                        </h1>
                        <p>
                          Lorem ipsum, dolor sit amet consectetur adipisicing
                          elit. Minus quidem maiores perspiciatis, illo maxime
                          voluptatem a itaque suscipit.
                        </p>
                        <div className="btn-box">
                          <a href="" className="btn1">
                            Contact Us
                          </a>
                          <a href="" className="btn2">
                            About Us
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="img-box">
                        <img src="images/slider-img.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ol className="carousel-indicators">
              <li
                data-target="#customCarousel"
                data-slide-to="0"
                className="active"
              ></li>
              <li
                data-target="#customCarousel"
                className="active"
                data-slide-to="1"
              ></li>
              <li
                data-target="#customCarousel"
                className="active"
                data-slide-to="2"
              ></li>
            </ol>
          </div>
        </section>
        {/* <!-- end slider section --> */}
      </div>

      {/* <!-- Product section --> */}

      <section
        ref={prdrf}
        onClick={() => {
          Changelgn();
        }}
        className="furniture_section layout_padding"
      >
        <div className="container">
          <div className="heading_container">
            <h2>Our Product</h2>
            <p>
              which don't look even slightly believable. If you are going to use
              a passage of Lorem Ipsum, you need to be sure there isn't an
            </p>
          </div>
          <div className="row">
            {products.slice(0, lmt).map((v, i) => {
              return (
                <div className="col-md-6 col-lg-4">
                  <div className="box">
                    <div className="img-box">
                      <img src={v.image} alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>{v.title}</h5>
                      <div className="price_box">
                        <h6 className="price_heading">
                          <span>$</span>
                          {v.price}
                        </h6>
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (isLogged) {
                              setPrice(v.price);
                              setOpnbuy(true);
                            } else {
                              toast.info("you have to login");
                            }
                          }}
                        >
                          Buy Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <a
          onClick={() => {
            setLmt(lmt == 6 ? 20 : 6);
          }}
          className="seeall"
        >
          {lmt == 6 ? "Show More" : "Show Less"}
        </a>
      </section>

      {/* <!-- end furniture section --> */}

      {/* <!-- about section --> */}

      <section
        ref={abtrf}
        onClick={() => {
          Changelgn();
        }}
        className="about_section layout_padding long_section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="img-box">
                <img src="images/about-img.png" alt="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-box">
                <div className="heading_container">
                  <h2>About Us</h2>
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Corrupti dolorem eum consequuntur ipsam repellat dolor soluta
                  aliquid laborum, eius odit consectetur vel quasi in quidem,
                  eveniet ab est corporis tempore.
                </p>
                <a href="">Read More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- end about section --> */}

      {/* <!-- blog section --> */}

      <section
        onClick={() => {
          Changelgn();
        }}
        className="blog_section layout_padding"
      >
        <div className="container">
          <div className="heading_container">
            <h2>Latest Blog</h2>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-4 mx-auto">
              <div className="box">
                <div className="img-box">
                  <img src="images/b1.jpg" alt="" />
                </div>
                <div className="detail-box">
                  <h5>Look even slightly believable. If you are</h5>
                  <p>
                    alteration in some form, by injected humour, or randomised
                    words which don't look even slightly believable.
                  </p>
                  <a href="">Read More</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mx-auto">
              <div className="box">
                <div className="img-box">
                  <img src="images/b2.jpg" alt="" />
                </div>
                <div className="detail-box">
                  <h5>Anything embarrassing hidden in the middle</h5>
                  <p>
                    alteration in some form, by injected humour, or randomised
                    words which don't look even slightly believable.
                  </p>
                  <a href="">Read More</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mx-auto">
              <div className="box">
                <div className="img-box">
                  <img src="images/b3.jpg" alt="" />
                </div>
                <div className="detail-box">
                  <h5>Molestias magni natus dolores odio commodi. Quaerat!</h5>
                  <p>
                    alteration in some form, by injected humour, or randomised
                    words which don't look even slightly believable.
                  </p>
                  <a href="">Read More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- end blog section --> */}

      {/* <!-- client section --> */}

      <section
        onClick={() => {
          Changelgn();
        }}
        className="client_section layout_padding-bottom"
      >
        <div className="container">
          <div className="heading_container">
            <h2>Testimonial</h2>
          </div>
          <div
            id="carouselExample2Controls"
            className="carousel slide"
            data-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row">
                  <div className="col-md-11 col-lg-10 mx-auto">
                    <div className="box">
                      <div className="img-box">
                        <img src="images/client.jpg" alt="" />
                      </div>
                      <div className="detail-box">
                        <div className="name">
                          <i
                            className="fa fa-quote-left"
                            aria-hidden="true"
                          ></i>
                          <h6>Siaalya</h6>
                        </div>
                        <p>
                          It is a long established fact that a reader will be
                          distracted by the readable cIt is a long established
                          fact that a reader will be distracted by the readable
                          c
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row">
                  <div className="col-md-11 col-lg-10 mx-auto">
                    <div className="box">
                      <div className="img-box">
                        <img src="images/client.jpg" alt="" />
                      </div>
                      <div className="detail-box">
                        <div className="name">
                          <i
                            className="fa fa-quote-left"
                            aria-hidden="true"
                          ></i>
                          <h6>Siaalya</h6>
                        </div>
                        <p>
                          It is a long established fact that a reader will be
                          distracted by the readable cIt is a long established
                          fact that a reader will be distracted by the readable
                          c
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row">
                  <div className="col-md-11 col-lg-10 mx-auto">
                    <div className="box">
                      <div className="img-box">
                        <img src="images/client.jpg" alt="" />
                      </div>
                      <div className="detail-box">
                        <div className="name">
                          <i
                            className="fa fa-quote-left"
                            aria-hidden="true"
                          ></i>
                          <h6>Siaalya</h6>
                        </div>
                        <p>
                          It is a long established fact that a reader will be
                          distracted by the readable cIt is a long established
                          fact that a reader will be distracted by the readable
                          c
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel_btn-container">
              <a
                className="carousel-control-prev"
                href="#carouselExample2Controls"
                role="button"
                data-slide="prev"
              >
                <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExample2Controls"
                role="button"
                data-slide="next"
              >
                <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- end client section --> */}

      {/* <!-- contact section --> */}
      <section
        ref={cntcrf}
        onClick={() => {
          Changelgn();
        }}
        className="contact_section  long_section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="form_container">
                <div className="heading_container">
                  <h2>Contact Us</h2>
                </div>
                <form action="">
                  <div>
                    <input type="text" placeholder="Your Name" />
                  </div>
                  <div>
                    <input type="text" placeholder="Phone Number" />
                  </div>
                  <div>
                    <input type="email" placeholder="Email" />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="message-box"
                      placeholder="Message"
                    />
                  </div>
                  <div className="btn_box">
                    <button>SEND</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <div className="map_container">
                <div className="map">
                  <div id="googleMap"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- end contact section --> */}

      {/* <!-- info section --> */}
      <section
        onClick={() => {
          Changelgn();
        }}
        className="info_section long_section"
      >
        <div className="container">
          <div className="contact_nav">
            <a href="">
              <i className="fa fa-phone" aria-hidden="true"></i>
              <span>Call : +212 777615601</span>
            </a>
            <a href="">
              <i className="fa fa-envelope" aria-hidden="true"></i>
              <span>Email : mohamedadyh00@gmail.com</span>
            </a>
            <a href="">
              <i className="fa fa-map-marker" aria-hidden="true"></i>
              <span>Morocco, Laayoune</span>
            </a>
          </div>

          <div className="info_top ">
            <div className="row ">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="info_links">
                  <h4>QUICK LINKS</h4>
                  <div className="info_links_menu">
                    <a className="" href="index.html">
                      Home <span className="sr-only">(current)</span>
                    </a>
                    <a className="" href="about.html">
                      {" "}
                      About
                    </a>
                    <a className="" href="furniture.html">
                      Products
                    </a>
                    <a className="" href="blog.html">
                      Blog
                    </a>
                    <a className="" href="contact.html">
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3 mx-auto">
                <div className="info_post">
                  <h5>INSTAGRAM FEEDS</h5>
                  <div className="post_box">
                    <div className="img-box">
                      <img src="images/f1.png" alt="" />
                    </div>
                    <div className="img-box">
                      <img src="images/f2.png" alt="" />
                    </div>
                    <div className="img-box">
                      <img src="images/f3.png" alt="" />
                    </div>
                    <div className="img-box">
                      <img src="images/f4.png" alt="" />
                    </div>
                    <div className="img-box">
                      <img src="images/f5.png" alt="" />
                    </div>
                    <div className="img-box">
                      <img src="images/f6.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info_form">
                  <h4>SIGN UP TO OUR NEWSLETTER</h4>
                  <form action="">
                    <input type="text" placeholder="Enter Your Email" />
                    <button type="submit">Subscribe</button>
                  </form>
                  <div className="social_box">
                    <a href="">
                      <i className="fa fa-facebook" aria-hidden="true"></i>
                    </a>
                    <a href="">
                      <i className="fa fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a href="">
                      <i className="fa fa-linkedin" aria-hidden="true"></i>
                    </a>
                    <a href="">
                      <i className="fa fa-instagram" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer
        onClick={() => {
          Changelgn();
        }}
        className="footer_section"
      >
        <div className="container">
          <p>
            &copy; <span id="displayYear"></span> All Rights Reserved By,
            Devlopper: Mohamed Aada
            <a href="https://html.design/">{" " + "Free Html Templates"}</a>
          </p>
        </div>
      </footer>
      {opnbuy ? (
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(chckoutcode) }}
          className="buywindow"
        ></div>
      ) : null}
      {lgnrgsop ? (
        <div className="dgcontainer">
          {tovrfc == false ? (
            <>
              <div
                style={{ backgroundColor: islogin ? "#6BB7BE" : "#f89646" }}
                className="option"
              >
                <button
                  onClick={() => {
                    setIsLogin(true);
                  }}
                  style={{
                    background: islogin ? "#f89646" : "transparent",
                    boxShadow: islogin ? "5px 0 3.2px -2px gray" : "",
                  }}
                  className={`lgn ${islogin ? "active" : ""}`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                  }}
                  style={{
                    background: islogin == false ? "#6BB7BE" : "transparent",
                    boxShadow: islogin == false ? "-5px 0 3.2px -2px gray" : "",
                  }}
                  className={`lgn ${islogin ? "" : "active"}`}
                >
                  Register
                </button>
              </div>
              {islogin ? (
                <div className="inputs">
                  <input
                    onChange={(e) => {
                      if (e.target.value != " ") {
                        setEmail(e.target.value);
                      }
                    }}
                    value={email}
                    placeholder="e-mail"
                    type="email"
                  />
                  <input
                    onChange={(e) => {
                      if (e.target.value != " ") {
                        setPass(e.target.value);
                      }
                    }}
                    value={pass}
                    placeholder="password"
                    type="password"
                  />
                </div>
              ) : (
                <div className="inputs">
                  <input
                    maxLength={8}
                    onChange={(e) => {
                      if (e.target.value != " ") {
                        setUsername(e.target.value);
                      }
                    }}
                    value={username}
                    placeholder="username"
                  />
                  <input
                    onChange={(e) => {
                      if (e.target.value != " ") {
                        setEmail(e.target.value);
                      }
                    }}
                    value={email}
                    placeholder="e-mail"
                    type="email"
                  />
                  <input
                    onChange={(e) => {
                      if (e.target.value != " ") {
                        setPass(e.target.value);
                      }
                    }}
                    value={pass}
                    type="password"
                    autoComplete="off"
                    placeholder="password"
                  />
                  <input
                    onChange={(e) => {
                      if (e.target.value != " ") {
                        setRepass(e.target.value);
                      }
                    }}
                    value={repass}
                    type="password"
                    autoComplete="off"
                    placeholder="repeat password"
                  />
                </div>
              )}
              <button
                style={{
                  backgroundColor: submitstt
                    ? islogin
                      ? "#f89646"
                      : "#6BB7BE"
                    : "#c4c4c4",
                }}
                onClick={Submit}
                className="sbmt"
              >
                {islogin ? "Login" : "Register"}
              </button>
              <div className="othr">
                {islogin ? (
                  <>
                    <p className="ngto">forgot password?</p>
                    <p
                      onClick={() => {
                        setIsLogin(false);
                      }}
                      className="ngto"
                    >
                      create an account?
                    </p>
                  </>
                ) : (
                  <p
                    onClick={() => {
                      setIsLogin(true);
                    }}
                    className="ngto"
                  >
                    i ready have an account?
                  </p>
                )}
              </div>
            </>
          ) : (
            <div>
              <h3
                className={lexend.className}
                style={{ textAlign: "center", color: "#373737" }}
              >
                Virification Code
              </h3>
              <OtpInput
                inputStyle={{ marginBottom: "12px" }}
                value={vrfinpt}
                onChange={(e) => {
                  setVrfInpt(e);
                }}
                numInputs={5}
                renderSeparator={<span></span>}
                renderInput={(props) => <input {...props} />}
              />
              <p
                onClick={() => {
                  setToVrfc(false);
                  setIsLogin(false);
                }}
                style={{ textAlign: "center" }}
                className="ngto"
              >
                i want to register?
              </p>
              <p
                onClick={() => {
                  setToVrfc(false);
                  setIsLogin(true);
                }}
                style={{ textAlign: "center" }}
                className="ngto"
              >
                i want to login?
              </p>
            </div>
          )}
        </div>
      ) : null}
      {opnpinfo ? (
        <div className="pinfo">
          <h2>Personal Information</h2>
          <label>Name</label>
          <div className="suminpts1">
            <input
              onChange={(e) => {
                setFname(e.target.value);
              }}
              value={fname}
              placeholder="first name"
              type="text"
              className="fnm"
            />
            <input
              onChange={(e) => {
                setLname(e.target.value);
              }}
              value={lname}
              placeholder="last name"
              type="text"
              className="lnm"
            />
          </div>
          <label>Adress</label>
          <div className="suminpts2">
            <input
              onChange={(e) => {
                let v = [...adress];
                v[0] = e.target.value;
                setAdress(v);
              }}
              placeholder="Street, house/apartment/ unit"
              type="text"
              value={adress[0]}
              className="fnm"
            />
            <input
              onChange={(e) => {
                let v = [...adress];
                v[1] = e.target.value;
                setAdress(v);
              }}
              placeholder="Country"
              type="text"
              value={adress[1]}
              className="lnm"
            />
            <span>{txtrslt}</span>
            <input
              onChange={(e) => {
                let v = [...adress];
                v[2] = e.target.value;
                setAdress(v);
              }}
              placeholder="City"
              type="text"
              value={adress[2]}
              className="lnm"
            />
            <input
              onChange={(e) => {
                let v = [...adress];
                v[3] = e.target.value.toString();
                setAdress(v);
              }}
              placeholder="Postal Code"
              type="number"
              value={adress[3]}
              className="lnm"
            />
          </div>
          <label>Phone Number</label>
          <div className="suminpts3">
            <span>{cpnumber}</span>
            <input
              type="number"
              onChange={(e) => {
                setPnumber(e.target.value);
              }}
              value={pnumber}
              className="fnm"
            />
          </div>
          <button
            onClick={() => {
              SubmitPinfo();
            }}
            className={lexend.className}
          >
            Submit
          </button>
        </div>
      ) : null}
      <ToastContainer />
    </div>
  );
}
