import paymentSample from "./images/payment-sample.jpeg";
import whatsappIcon from "./images/whatsapp.png";
import Image from "next/image";
import Link from "next/link";

export default function BankTransferInstructions({
  contestantName,
  contestantId,
  numberOfVotes,
}: {
  contestantName: string;
  contestantId: string;
  numberOfVotes: number;
}) {
  return (
    <div className="flex-1 space-y-8 overflow-y-auto">
      <ol className="list-decimal list-inside gap-4 text-muted-foreground text-sm">
        <li>
          Use the following bank details to complete your transfer of{" "}
          <span className="font-bold">
            {`N${new Intl.NumberFormat("en-US").format(numberOfVotes * 50)}`}
          </span>{" "}
          for <span className="font-bold">{`${numberOfVotes} votes`}</span>
          <ul className="list-disc list-inside mt-4">
            <li>
              Account Name:{" "}
              <span className="font-bold">Leadrite Kiddies Hub</span>
            </li>
            <li>
              Account Number: <span className="font-bold">1221812034</span>
            </li>
            <li>
              Bank: <span className="font-bold">Zenith Bank</span>
            </li>
          </ul>
        </li>
        <li className="mt-4">
          After transfer, <span className="font-bold">tap</span> the WhatsApp
          icon <span className="font-bold"> below</span> and send the following
          through the WhatsApp:
          <ul className="list-disc list-inside mt-2">
            <li>
              Contestant&apos;s name and ID{" "}
              <span className="font-bold">
                ({`${contestantName} - ${contestantId}`})
              </span>
            </li>
            <li>Your name, and amount paid.</li>
            <li>Proof of payment (deposit/transfer receipt)</li>
          </ul>
        </li>
        <div className="mt-4 space-y-2">
          <p className="font-bold">For example:</p>
          <div className="rounded-md overflow-clip">
            <Image src={paymentSample} alt="voting sample image" />
          </div>
        </div>
        <li className="mt-4">
          You&apos;ll get a response about your vote getting confirmed and
          updated.
        </li>
      </ol>

      <div className="fixed bottom-8">
        <Link href="https://wa.me/message/77FREZ34LRFLK1">
          <Image src={whatsappIcon} alt="whatsapp icon" width={40} />
        </Link>
      </div>
    </div>
  );
}
