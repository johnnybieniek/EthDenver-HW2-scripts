import { ethers } from "ethers"
import { Ballot__factory } from "../typechain-types"

import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const deployedContractAddress = "0xa92e8E513E72F98c2313a2912d1B792b5Ee426FA"

const voterAddress = ""

async function main() {
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)

    const ballotContractFactory = new Ballot__factory(signer)
    const ballotContract = await ballotContractFactory.attach(deployedContractAddress)
    console.log(`Checking whether the account has voting rights..`)
    const weight = (await ballotContract.voters(voterAddress)).weight

    if (weight.eq(0)) {
        console.log("This user doesn't have voting rights!")
        console.log("Giving this address voting rights...")
        await ballotContract.giveRightToVote(voterAddress)
        console.log(`Done! ${voterAddress} has the right to vote!`)
    } else {
        console.log(`Hey! ${voterAddress} already has voting rights!`)
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
