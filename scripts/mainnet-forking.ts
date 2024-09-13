import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const LDO = "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32";

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const amountOut = ethers.parseUnits("20", 18);
    const amountInMax = ethers.parseUnits("1000", 6);

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    const DAI_Contract = await ethers.getContractAt("IERC20", DAI);
    const LDO_Contract = await ethers.getContractAt("IERC20",LDO,impersonatedSigner);
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    //approve token

    await USDC_Contract.approve(ROUTER, amountOut);

    const usdcBal = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBal = await DAI_Contract.balanceOf(impersonatedSigner.address);
    const ldoBal = await LDO_Contract.balanceOf(impersonatedSigner.address);

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("usdc balance before swap", Number(usdcBal));
    console.log("dai balance before swap", Number(daiBal));
    // console.log("ldo balance before swap", Number(ldoBal));


    await ROUTER.swapTokensForExactTokens(
        amountOut,
        amountInMax,
        [USDC, DAI],
        impersonatedSigner.address,
        deadline
    );

    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    // const daiBalAfter = await DAI_Contract.balanceOf(impersonatedSigner.address);
    const ldoBalAfter = await LDO_Contract.balanceOf(impersonatedSigner.address);


    console.log("=========================================================");

    console.log("usdc balance after swap", Number(usdcBalAfter));
    console.log("dai balance after swap", Number(ldoBalAfter));



    //for adding liquidity

    const amountADesired = ethers.parseUnits("1",18);
    const amountBDesired = ethers.parseUnits("1",18)
    const amountAMin = ethers.parseUnits("0", 18);
    const amountBMin = ethers.parseUnits("0", 18)



    await USDC_Contract.approve(ROUTER, amountOut);
    await LDO_Contract.approve(ROUTER, amountOut);

    console.log("usdc balance before swap", Number(usdcBal));
    // console.log("dai balance before swap", Number(daiBal));
    console.log("ldo balance before swap", Number(ldoBal));

    await ROUTER.addLiquidity(
        USDC,
        LDO,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        TOKEN_HOLDER,
        deadline
    );


 



    console.log("usdc after before swap", Number(usdcBal));
    console.log("ldo balance before swap", Number(ldoBal));


    





    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
