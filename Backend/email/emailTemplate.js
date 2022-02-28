
const getEmailTemplate = (state, content, detailName,details,nameAndLink) =>
`
<div style="border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family:
roboto;width:650px;text-align:center;margin:0 auto;">
<div><img style="margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;"
        src="${process.env.CLIENT_LOGO}" alt="logo"></div>
<div>
    <h1 style="width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size:
        20px;letter-spacing: 0.5px;"><b>Phone No: 02 9997 5344</b></h1>
</div>
<hr>
<div>
    <h2 style="color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;">
        ${state}</h2>
    <h2 style="color:#000;font-size:18px;font-weight: 500; padding: 10px;text-align:
        left;margin-left: 15px;">	
        ${content}
</h2>
</div>
<table cellpadding="4" cellspacing="0" align="center" style="color: #111;border: px solid #DDD;border: px
    solid #dcdde0;border-top:0;border-bottom: 0px;" width="650">
    <td width="150">&nbsp;</td>
   ${
    details.length
       ? ` <td width="400" align="center" style="padding-top:10px;padding-bottom:30px;border: 1px solid gray;">
      <h2
        style="color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display:
         inline-block;width: 92%; margin: 0px 0px 0px 0px;"
      >
        ${detailName}
      </h2>

      ${details
        .map((detail) => `<p style="text-align: left; padding:0px 5px 0px 5px;">${detail.key}: ${detail.value}</p>`)
        .toString()
        .replace(/,/g, '')}

      
      <hr />
      <p  style="text-align: left; padding:0px 5px 0px 5px;">
      Please login the system to see this booking
        <br /> ${nameAndLink.name}: "${nameAndLink.link}"
      </p>
    </td>`
       : ''
   }
   
    <td width="150">&nbsp;</td>
</table>
<div width="550" align="left" style="font-size: 20px;padding-bottom:5px;line-height: 24px;">
    <h2 style="color:#000;font-size:18px;font-weight: 500;  ;padding: 0; margin: 15px 0px 20px 15px;">Please
        contact us at info@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2>
    <h2 style="color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;">
    </h2>
    <h2 style="color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 5px 15px;">
        Thanks</h2><img style="max-width: 40%;float: left;margin-left: 15px;"
        src="${process.env.CLIENT_LOGO}" alt="logo"><br><br>
    <h2 style="color:#000;font-size:13px;font-weight: 500; margin-top:30px; padding: 0;margin-left: 15px; margin-right: 10px;">ATTENTION
        - This message and any attached files may contain information that is confidential, legally privileged or
        proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or
        the person responsible for delivering the message to the intended recipient, be advised that you have
        received this message in error. Any dissemination, copying, use or re-transmission of this message or
        attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2>
</div>
<div align="center" style="padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color:
    #fff;width:650px;">©&nbsp;Copyright ${new Date().getUTCFullYear()} - <a style="color: #0398d5;">smartboating.com.au</a></div>
</div>
</div>



`;


module.exports = getEmailTemplate;