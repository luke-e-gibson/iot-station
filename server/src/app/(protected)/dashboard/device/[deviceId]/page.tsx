export default async function DevicePage({ params }: { params: { deviceId: string } }) {
    return <>
        <div>Device ID: {params.deviceId}</div>
    </>
}