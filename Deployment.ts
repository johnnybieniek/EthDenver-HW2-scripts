import { ethers } from "ethers"
import { Ballot__factory } from "../typechain-types"

import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

const PROPOSALS = ["Chocolate", "Vanilla", "Lemon"]

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = []
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]))
    }
    return bytes32Array
}

async function main() {
    console.log("Deploying Ballot contract")

    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_GOERLI })
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)
    const balance = await signer.getBalance()
    console.log(`my balance is: ${balance}Eth`)

    const ballotContractFactory = new Ballot__factory(signer)
    const ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(PROPOSALS)
    )
    await ballotContract.deployed()
    console.log(`The ballot smart contract was deployed at ${ballotContract.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
