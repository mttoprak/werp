import {useParams} from "react-router-dom";


function InvitePage() {
    const {inviteid} = useParams();

    // inviteid ile kontrol işlemlerini burada yapabilirsin
    return (
        <div>
            Davet ID: {inviteid}
        </div>
    );
}

export default InvitePage;