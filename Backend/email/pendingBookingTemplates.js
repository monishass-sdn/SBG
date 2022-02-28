const bookingTemplate = (bookingState,content,bookingDetails)=>(

    `<div style="border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family:
    roboto;width:650px;text-align:center;margin:0 auto;">
    <div><img style="margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;"
            src="http://65.2.28.16/api/uploads/logo.png" alt="logo"></div>
    <div>
        <h1 style="width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size:
            20px;letter-spacing: 0.5px;"><b>Phone No: 02 9997 5344</b></h1>
    </div>
    <hr>
    <div>
        <h2 style="color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;">
            ${bookingState}</h2>
        <h2 style="color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align:
            left;margin-left: 46px;">${content} </h2>
    </div>
    <table cellpadding="4" cellspacing="0" align="center" style="color: #111;border: px solid #DDD;border: px
        solid #dcdde0;border-top:0;border-bottom: 0px;" width="650">
        <td width="150">&nbsp;</td>
        <td width="400" align="center" style="padding-top:10px;padding-bottom:30px;border: 1px solid gray;">
            <h2 style="color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display:
                inline-block;width: 92%; margin: 0px 0px 0px 0px;">Booking Details</h2>
            <p>${bookingDetails}</p>
            <hr>
            <p><br> Booking Link:"http://65.2.28.16/boat-bookings"</p>
        </td>
        <td width="150">&nbsp;</td>
    </table>
    <div width="550" align="left" style="font-size: 20px;padding-bottom:5px;line-height: 24px;">
        <h2 style="color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;">Please
            contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2>
        <h2 style="color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;">
        </h2>
        <h2 style="color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;">
            Thanks</h2><img style="max-width: 40%;float: left;margin-left: 60px;"
            src="http://65.2.28.16/api/uploads/logo.png" alt="logo/"><br><br>
        <h2 style="color:#000;font-size:14px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;">ATTENTION
            - This message and any attached files may contain information that is confidential, legally privileged or
            proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or
            the person responsible for delivering the message to the intended recipient, be advised that you have
            received this message in error. Any dissemination, copying, use or re-transmission of this message or
            attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2>
    </div>
    <div align="center" style="padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color:
        #fff;width:650px;">©&nbsp;Copyright 2021 - <a style="color: #0398d5;">smart boating.com.</a></div>
</div>
</div>`
)

module.exports = bookingTemplate;