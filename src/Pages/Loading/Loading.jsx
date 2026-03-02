import { MutatingDots } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-linear-to-br from-[#0B1220] via-[#0F172A] to-[#111827]">
      <MutatingDots
visible={true}
height="100"
width="100"
color="#9333EA"
secondaryColor="#4F46E5"
radius="12.5"
ariaLabel="mutating-dots-loading"
wrapperStyle={{}}
wrapperClass=""
/>
    </div>
  )
}
