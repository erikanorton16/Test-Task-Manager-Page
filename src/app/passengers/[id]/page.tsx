import PassengerProfileClient from "./PassengerProfileClient";

export default function PassengerProfilePage({ params }: { params: { id: string } }) {
  return <PassengerProfileClient id={params.id} />;
}
