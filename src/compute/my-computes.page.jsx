import { ProviderInstance, signHash } from "@oceanprotocol/lib";
import axios from "axios";
import { AccountContext, OceanConfigContext } from "../App";
import { useContext, useEffect, useState } from "react";
import Web3 from "web3";
import ComputeCard from "./computeCard.component";
import { NavLink } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";

const MyComputesPage = () => {
    const { oceanConfig } = useContext(OceanConfigContext);
    const [computeJobs, setComputeJobs] = useState(null);
    const { currentAccount, _ } = useContext(AccountContext);

    const [isLoading, setIsLoading] = useState(true);

    const endpoint = "https://v4.provider.mumbai.oceanprotocol.com/api/services/compute/";

    useEffect(() => {
        const getDDO = async () => {
            console.log(oceanConfig);
            // const exampleMessage = "Example `personal_sign` message.";
            // let signedmessage = "";
            // try {
            //     const from = currentAccount;
            //     const msg = `0x${Buffer.from(exampleMessage, "utf8").toString("hex")}`;
            //     const sign = await window.ethereum.request({
            //         method: "personal_sign",
            //         params: [msg, from, "Example password"],
            //     });
            //     console.log(sign);
            //     signedmessage = sign;
            // } catch (err) {
            //     console.error(err);
            // }

            if (currentAccount === null)
                toast.error("Please connect wallet", {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            Web3.utils.toChecksumAddress(currentAccount);
            const response = await ProviderInstance.computeStatus(
                oceanConfig.providerUri,
                Web3.utils.toChecksumAddress(currentAccount)
            );

            console.log({ response });
            setComputeJobs(response);
        };

        getDDO();
    }, [currentAccount]);

    useEffect(() => {
        if (computeJobs) {
            console.log(computeJobs);
            setIsLoading(false);
        }
    }, [computeJobs, currentAccount]);
    return (
        <div className="bg-white rounded-md h-full overflow-y-scroll">
            <h1 className="font-light text-xl p-5 text-center">Compute Status</h1>
            {isLoading ? (
                <div className="flex justify-center align-middle items-center h-80v">
                    <MoonLoader color="#000000" size={30} />
                </div>
            ) : (
                <div className="p-5">
                    {computeJobs
                        .sort((job1, job2) => Date(job2.created) - Date(job1.created))
                        .map((computeJob) => (
                            <NavLink to={"/computeDetails/" + computeJob.jobId}>
                                <ComputeCard computeJob={computeJob} key={computeJob.jobId} />
                            </NavLink>
                        ))}
                </div>
            )}
        </div>
    );
};

export default MyComputesPage;
