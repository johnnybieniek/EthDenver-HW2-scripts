import { ethers } from "ethers"
import { Ballot__factory } from "../typechain-types"

import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const deployedContractAddress = "0xa92e8E513E72F98c2313a2912d1B792b5Ee426FA"

const delegateTo = "" // address of the person that will receive more voting power

async function main() {
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)

    const ballotContractFactory = new Ballot__factory(signer)
    const ballotContract = await ballotContractFactory.attach(deployedContractAddress)
    console.log(`Checking whether the account has voting rights..`)

    const weight = (await ballotContract.voters(signer.address)).weight
    const hasVoted = (await ballotContract.voters(signer.address)).voted

    if (!weight.eq(0) || hasVoted) {
        console.log("You cannot delegate your vote. Please check the rules")
    } else {
        await ballotContract.delegate(delegateTo)
        console.log(`You have successfully delegated your vote to ${delegateTo}`)
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
