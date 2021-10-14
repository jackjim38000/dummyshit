import React, { useState, useEffect } from 'react';
import Modal from '../utils/Modal';
import background from "../images/stars.gif";
import Web3 from "web3";

import { ADDRESS, ABI } from "../config.js"

function HeroHome() {

  const [videoModalOpen, setVideoModalOpen] = useState(false);
    // FOR WALLET
    const [signedIn, setSignedIn] = useState(false)

    const [walletAddress, setWalletAddress] = useState(null)

    // FOR MINTING
    const [how_many_bananas, set_how_many_bananas] = useState(1)

    const [bananaContract, setBananaContract] = useState(null)

    // INFO FROM SMART Contract

    const [totalSupply, setTotalSupply] = useState(0)

    const [saleStarted, setSaleStarted] = useState(false)

    const [bananaPrice, setBananaPrice] = useState(0)

 

    async function signIn() {
        if (typeof window.web3 !== 'undefined') {
            // Use existing gateway
            window.web3 = new Web3(window.ethereum);

        } else {
            alert("No Ethereum interface injected into browser. Read-only access");
        }

        window.ethereum.enable()
            .then(function (accounts) {
                window.web3.eth.net.getNetworkType()
                    // checks if connected network is mainnet (change this to rinkeby if you wanna test on testnet)
                    .then((network) => { console.log(network); if (network != "main") { alert("You are on " + network + " network. Change network to mainnet or you won't be able to do anything here") } });
                let wallet = accounts[0]
                setWalletAddress(wallet)
                setSignedIn(true)
                callContractData(wallet)

            })
            .catch(function (error) {
                // Handle error. Likely the user rejected the login
                console.error(error)
            })
    }

    //

    async function signOut() {
        setSignedIn(false)
    }

    async function callContractData(wallet) {
        // let balance = await web3.eth.getBalance(wallet);
        // setWalletBalance(balance)
        const bananaContract = new window.web3.eth.Contract(ABI, ADDRESS)
        setBananaContract(bananaContract)

        const salebool = await bananaContract.methods.saleIsActive().call()
        // console.log("saleisActive" , salebool)
        setSaleStarted(salebool)

        const totalSupply = await bananaContract.methods.totalSupply().call()
        setTotalSupply(totalSupply)

        const bananaPrice = await bananaContract.methods.bananaPrice().call()
        setBananaPrice(bananaPrice)

    }

    async function mintBanana(how_many_bananas) {
        if (bananaContract) {

            const price = Number(bananaPrice) * how_many_bananas

            const gasAmount = await bananaContract.methods.mintBoringBanana(how_many_bananas).estimateGas({ from: walletAddress, value: price })
            console.log("estimated gas", gasAmount)

            console.log({ from: walletAddress, value: price })

            bananaContract.methods
                .mintBoringBanana(how_many_bananas)
                .send({ from: walletAddress, value: price, gas: String(gasAmount) })
                .on('transactionHash', function (hash) {
                    console.log("transactionHash", hash)
                })

        } else {
            console.log("Wallet not connected")
        }

    };




    return (



      <section className="relative">


          <div className="mx-auto">

                {/*<div style={{
              backgroundImage: `url(${background})`,
              width: '100%',
              height: '100%'
          }}>*/}
                    <div className="flex auth justify-end">
                        {!signedIn ? <button onClick={signIn} className="montserrat inline-block border-2 border-black bg-black border-opacity-0 no-underline hover:text-black py-2 px-4 mx-4 shadow-lg hover:bg-blue-500 hover:text-gray-100">Connect Wallet with Metamask</button>
                            :
                            <button onClick={signOut} className="montserrat inline-block border-2 border-black bg-white border-opacity-0 no-underline hover:text-black py-2 px-4 mx-4 shadow-lg hover:bg-blue-500 hover:text-gray-100">Wallet Connected: {walletAddress}</button>}
                    </div>
                  {/* Hero content */}
                  <div className="pt-32 pb-16 md:pt-30 md:pb-10">

                      {/* Section header */}
                      <div className="text-center pb-12 md:pb-16">

                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="cosmicfont bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-400">Cosmic</span><span className="cosmicfont bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Kittens</span></h1>

                          <div className="max-w-10xl mx-auto">
                              <p className="text-xl text-red-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                                  Cosmic Kittens is an animated generative collection of 4,444 space-faring kittens that are up for adoption. <br></br>

                                  With over 80 traits and 30 species, each Cosmic Kitten NFT is verifiably rare and unique. <br></br>
                                  Additionally, there will be a small subset of Moon Rare, Star Rare, and Cosmic Rare kittens. <br></br>

                                  Adopting a kitten will cost 0.04444 ETH and owning a kitten will grant you early access to all future events.<br></br>
                              </p>
                              <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                                  <div>
                                        {saleStarted ?
                                            <button onClick={() => mintBanana(1)} a className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0">mint one kitten</button>
                                            : <button className="mt-4 Poppitandfinchsans text-4xl border-6 bg-blau  text-white hover:text-black p-2 ">SALE IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>

                                        }
                          
                                    </div>
                                    <div>

                                        {saleStarted ?
                                            <button onClick={() => mintBanana(5)} a className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0">mint five kittens</button>
                                            : <button className="mt-4 Poppitandfinchsans text-4xl border-6 bg-blau  text-white hover:text-black p-2 ">SALE IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>

                                        }
                                    </div>
                                    <div>

                                        {saleStarted ?
                                            <button onClick={() => mintBanana(10)} a className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0">mint ten kittens</button>
                                            : <button className="mt-4 Poppitandfinchsans text-4xl border-6 bg-blau  text-white hover:text-black p-2 ">SALE IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>

                                        }
                                    </div>
                                  <div>
                               </div>
                              </div>
                          </div>
                      </div>
              </div>
    </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero content */}
        <div className="pt-2 pb-6 md:pt-5 md:pb-1">

          {/* Section header */}
                  <div className="text-center pb-1 md:pb-1">
                      
                    </div>

                    {/* Top area: Blocks */}
                    <div className="grid sm:grid-cols-12 py-8 md:py-12 border-t border-gray-200">

                        {/* 1st block */}
                        <div className="sm:col-span-6 md:col-span-3 lg:col-span-3.5">
                            <img className="mx-auto" src={require('../images/R2.jpeg').default} width="768" height="432" alt="Hero" />

                        </div>

                        {/* 2nd block */}
                        <div className="sm:col-span-6 md:col-span-3 lg:col-span-3.5">
                            <img className="mx-auto" src={require('../images/R2.jpeg').default} width="768" height="432" alt="Hero" />

                        </div>

                        {/* 3rd block */}
                        <div className="sm:col-span-6 md:col-span-3 lg:col-span-3.5">
                            <img className="mx-auto" src={require('../images/R2.jpeg').default} width="768" height="432" alt="Hero" />

                        </div>

                        {/* 4th block */}
                        <div className="sm:col-span-6 md:col-span-3 lg:col-span-3.5">
                            <img className="mx-auto" src={require('../images/R2.jpeg').default} width="768" height="432" alt="Hero" />
                        </div>

                    </div>


        </div>

      </div>
    </section>
  );
}

export default HeroHome;