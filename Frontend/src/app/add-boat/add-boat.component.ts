import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { from } from 'rxjs';
import { formatDate } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
// import environment for add boat  Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';

///testing...ashly.....

declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-add-boat',
  templateUrl: './add-boat.component.html',
  styleUrls: ['./add-boat.component.css']
})
export class AddBoatComponent implements OnInit {
  form: FormGroup;
  boatform: FormGroup;
  imageForms: FormGroup;
  seasonForms: FormGroup;
  manageOwnerForms: FormGroup;
  previousDate: any;
  launchDate: any;
  imageResponse = "";
  boarText = ""
  Public_Boat_original_Owner_Manual = "";
  public_Boat_Owner_Manual = "";
  EnvironmentURL:string = environment.url;

  url = this.EnvironmentURL+"api/Boat"
  OwnerUrl = this.EnvironmentURL+"api/Owner"


  public_MultipleImageName: any = [];

  public_SingleImageName: any;


  images: any = [];
  handBook: File;
  handBook2: File;
  boats: any = [];
  owners: any = [];
  fromDate: any = [];
  toDate: any = [];
  loctions: any;
  boatTypes: any;
  imgUrl: any = [];
  boatTypeName: any;
  loctionName: any;
  resultBoatType: any;
  Boattype_Name: any;
  ownersAllowed: any;
  multiImg: any = [];
  boat_id: any;
  viewOwners: any = [];
  getSeason: any = [];
  season_id: any;
  seasonList: any = [];

  Boat_Handbook_Name: any;
  Boat_Handbook_Name2: any;

  multiImg_Angular: any = [];


  submitted = false;
  boatSubmitted = false;
  seasonSubmitted = false;
  manageOwnerSubmitted = false;
  getBoatAndSeason: any;
  getManageOwner: any;
  fromWDate: any;
  toWDate: any;
  launchDates: string;
  preLaunchDates: string;
  sssD: string;
  stD: string;
  fwD: string;
  fwd: string;
  adminlogin: any;
  dropdownSettings: IDropdownSettings;
  commenMessages:any;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private SpinnerService: NgxSpinnerService) {
    this.createForm();
    this.createBoatForm();
    this.imageForm();
    this.seasonForm();
    this.manageOwnerForm();
  }



  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });

    
    this.adminlogin = JSON.parse(sessionStorage.getItem("adminLogin"));
    if (this.adminlogin == false) {
      this.router.navigate(['']);
    }
    


    this.boatform.get('Owners_Allowed').setValue(1);
    this.dropdownSettings = {
      singleSelection: true,
      idField: '_id',
      textField: 'Boat_Type',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: "No data available"
      //maxHeight : 100        

    };
    this.sidemenuloder();
    this.boatform.get('Boat_Status').setValue("Enable");

    sessionStorage.setItem("relodePg_book-for-owner", "1");
    sessionStorage.setItem("Adminbooking-relodePg", "1");
    sessionStorage.setItem("boat-maintenance-reload", "1");
    sessionStorage.setItem("view-boat-reload", "1");
    //sibi start ........................


    //.............LatestCode datepiker...

    $('#Lates_datepicker-prelaunch-date').Zebra_DatePicker({
      format: 'd/m/Y',
      pair: $('#Lates_datepicker-launch-date') 
    });
    $('#Lates_datepicker-launch-date').Zebra_DatePicker({
      format: 'd/m/Y'
    });
    
    $('#Latest_Summer_From_Date').Zebra_DatePicker({
      format: 'd/m/Y',
      pair: $('#Latest_Summer_To_Date') 
    });

    $('#Latest_Summer_To_Date').Zebra_DatePicker({
      format: 'd/m/Y',
      pair: $('#Latest_Winter_From_Date')
    });

    $('#Latest_Winter_From_Date').Zebra_DatePicker({
      format: 'd/m/Y',
      pair: $('#Latest_Winter_To_Date')
    });
    
    $('#Latest_Winter_To_Date').Zebra_DatePicker({
      format: 'd/m/Y'
      
    });
    


    //...............End...................





    function CommenMessage(obj){
      $("#h4-message-type").text("Message");
      $("#p-message-content").text(obj);
      $('#btn-CommenMessage-disp-btns').trigger('click');
      //alert();
  }
  
  function CommenMessage_save(obj){
      $("#h4-message-save-type").text("Message");
      $("#p-message-save-content").text(obj);
      $('#btn-CommenMessage-save-disp-btns').trigger('click');
      //alert();
  }
  

    $("#div-binding-multiple-images").html("");
    var tempimageIdGenerate = 100000;

    function previewImages() {
      var $preview = $('#div-binding-multiple-images');
      if (this.files) $.each(this.files, readAndPreview);

      function readAndPreview(i, file) {
        //Upload boat image max size exceeded message for add boat Done By Alagesan  on 15.06.2021
        var maxSize = 2097152;
        var current_size = file.size;
        if (current_size < maxSize) {
        var filename = file.name;
        filename = filename.replace(/\s+/g, '');

        if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
         
          //this.commenMessages =file.name + " is not an image";

        //return $('#btn-CommenMessage-disp-btns').trigger('click');

         
           return CommenMessage("You are attempting to upload the incorrect file type. It must be an image, e.g. jpeg, jpg or png");
        } // else...

        var reader = new FileReader();
        $(reader).on("load", function () {
          $preview.append($('<div class="custom-file_edit col-md-6 col-sm-12 mb-3" id=' + tempimageIdGenerate + '>\
          <span class="cls close-button-multiimages" Imgnames='+ filename + ' id=' + tempimageIdGenerate + '><i class="fa fa-close"></i></span>\
          <div class="editImg">\
            <img src="'+ this.result + '" alt="image">\
          </div>\
          <p class="boatName">'+ filename + '</p>\
        </div>'));
          tempimageIdGenerate = tempimageIdGenerate + 10;
        });


        reader.readAsDataURL(file);
        }
      }

     


    }

    function finding_multipleImageEmpty(){       
      var dataschek_tmp = $('.close-button-multiimages').attr('id');
      if(dataschek_tmp === undefined){

        sessionStorage.setItem("multifile_Ang_Addboat", "");

      }      
    }


    function previewImages_Name_single() {
      //var $preview = $('#div-binding-multiple-images');
      if (this.files) $.each(this.files, readAndPreviewPDF);
      function readAndPreviewPDF(i, file) {
        var filename = file.name;
        filename = filename.replace(/\s+/g, '');
        if (!/\.(pdf)$/i.test(file.name)) {
         
          //this.commenMessages =file.name + " is not an PDF";

        // $('#btn-CommenMessage-disp-btns').trigger('click');
           return CommenMessage("You are attempting to upload the incorrect file type. It must be a pdf.");
        } // else...

        var reader_pdf = new FileReader();
        $(reader_pdf).on("load", function () {
          $("#spn-id-fileName").text(filename);
        });
        reader_pdf.readAsDataURL(file);
      }
    }

    function previewImages_Name_single2() {
      //var $preview = $('#div-binding-multiple-images');
      if (this.files) $.each(this.files, readAndPreviewPDF2);
      function readAndPreviewPDF2(i, file) {
        var filename = file.name;
        filename = filename.replace(/\s+/g, '');
        if (!/\.(pdf)$/i.test(file.name)) {
         
          //this.commenMessages =file.name + " is not an PDF";

        // $('#btn-CommenMessage-disp-btns').trigger('click');
           return CommenMessage("You are attempting to upload the incorrect file type. It must be a pdf.");
        } // else...

        var reader_pdf = new FileReader();
        $(reader_pdf).on("load", function () {
          $("#spn-id-fileName2").text(filename);
        });
        reader_pdf.readAsDataURL(file);
      }
    }

    $('#customFile').on("change", previewImages);
    $('#id_singlefile').on("change", previewImages_Name_single);
    $('#id_singlefile2').on("change", previewImages_Name_single2);

    $(document).on("click", ".close-button-multiimages", function () {
   
      var imgArrySplit = [];
      var getid = $(this).attr('id');
      var getImgnames = $(this).attr('Imgnames');
      var temp3_replace = getid.replace(".", "-");
      var mulangul = sessionStorage.getItem("multifile_Ang_Addboat");
      imgArrySplit = mulangul.split(",");
      imgArrySplit = jQuery.grep(imgArrySplit, function (value) {
        return value != getImgnames;
      });
      sessionStorage.setItem("multifile_Ang_Addboat", imgArrySplit.toString());
      $("#" + temp3_replace).remove();
      var tmp_mul = sessionStorage.getItem("multifile_Ang_Addboat");
      if(typeof tmp_mul === "undefined" || tmp_mul == null  || tmp_mul == "")
      {
        //location.reload();
      }

      finding_multipleImageEmpty();

    });

    // $('#example').DataTable();
    function selectDate(date) {
      $('.calendar-wrapper').updateCalendarOptions({
        date: date
      });
    }

    $('#example').DataTable();

    var defaultConfig = {
      weekDayLength: 1,
      date: new Date(),
      onClickDate: selectDate,
      showYearDropdown: true,
    };

    $('.calendar-wrapper').calendar(defaultConfig);

    this.getOwners();
    this.getBoats();
    this.getLoction();
    this.getBoatType();  
    this.startTimer_ChekkingEmptyImage();
  }

// .................................................



 
  Commen_Date_Formate(convertDate) {
   var preLS = new Date(convertDate);
   var preLaunchDates =  (preLS.getDate()) + '/' + (preLS.getMonth() + 1)  + '/' + preLS.getFullYear();       
   return preLaunchDates;

 }


 startTimer_ChekkingEmptyImage(){

  setInterval(() => {

    try
    {    
      var getBoateImagesFind = sessionStorage.getItem("multifile_Ang_Addboat");
      if(getBoateImagesFind == ""){

        this.multiImg = [];
                 
        this.multiImg_Angular = [];

      }
    }
    catch{}


  }, 100);

 }






//...............................................

  sidemenuloder() {
      $("#a-menu-boat-main").attr("aria-expanded", "true");
      $("#a-menu-boat-main").removeClass("collapsed");
      $("#id-submenu-child-boat-Add-Boat").
        css({
          "background": "white", "color": "black",
          "padding": "inherit", "border-radius": "inherit", "margin-right": "-9px"
        });
      $("#boat").addClass("show");
  }

 

 

  onFileChange_old(event, imageFor) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
        }
        this.multiImg.push(event.target.files[i]);
      }

      if (this.multiImg) {
        const fd = new FormData();
        for (let i = 0; i < this.multiImg.length; i++) {
          this.images.push(this.multiImg[i].name)
          fd.append("files", this.multiImg[i]);
        }
        this.http.post<any>(`${this.url}/FileUploadmany`, fd).subscribe(data => {

          this.boatform.get('Boat_Image').setValue(this.multiImg.name);

        }, err => {
         
        })
      }
    }
  }


  onboatSelect(items: any) {
  }

  locationReload(){
    location.reload();
  }

  onFileChange(event, imageFor) { 
    console.log(event);
debugger;
    var current_Array = [];
    var pervious_Array = [];
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
        }
        var current_Name = event.target.files[i].name;
        current_Name = current_Name.replace(/\s+/g, '');
        var nameCheck = current_Array.find(x => x == current_Name);
        if (nameCheck == current_Name) {

          this.commenMessages ="multiple file name not allowed";

          $('#btn-CommenMessage-save-disp-btns').trigger('click');

          break;
        }
        else {          
          var maxSize = 2097152;
          var current_size = event.target.files[i].size;
          var current_type = event.target.files[i];          
          if (current_size > maxSize) {
           
            this.imageResponse = "Boat image maximum size is exceeded"
            $('#imageBoatModel').trigger('click');
          }
          if (current_size < maxSize) {
          this.multiImg.push(event.target.files[i]);          
          this.multiImg_Angular.push(current_Name);
         
          }
        }
      }  

      sessionStorage.setItem("multifile_Ang_Addboat", this.multiImg_Angular);
    }
  }

  onFileChange_old_15_April_2021(event, imageFor) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
        }
        this.multiImg.push(event.target.files[i]);
      }
    }
  }

  singleImage(event, imageFor) {
    this.handBook = <File>event.target.files[0];
    if (this.handBook != null) {
      this.Boat_Handbook_Name = event.target.files[0].name;
      

    }
  }

  singleImage2(event, imageFor) {
    this.handBook2 = <File>event.target.files[0];
    if (this.handBook2 != null) {
      this.Boat_Handbook_Name2 = event.target.files[0].name;
      
      this.Owner_Manual_PDF_Upload();

    }
  }


  
  Owner_Manual_PDF_Upload(){
    debugger
    const fd2 = new FormData();
      fd2.append("file", this.handBook2);
          this.http.post<any>(`${this.url}/FileUploadSingle`, fd2).subscribe(data => {
          
            
            if (data.status) {

              var data_tmp = data.data;
              
              this.Public_Boat_original_Owner_Manual = data_tmp.originalname;
              this.public_Boat_Owner_Manual = data_tmp.filename;

              

            }

            
            
            

          }, err => {

           // this.commenMessages ="Boat Handbook Empty";

             //$('#btn-CommenMessage-save-disp-btns').trigger('click');

            
          
          })

  }




  addBoat() { 
    
   var getBoateImagesFind = sessionStorage.getItem("multifile_Ang_Addboat");
    if(getBoateImagesFind == null){
      getBoateImagesFind = "";

    }
       
  
    this.boatform.get('Block').setValue(true);
    this.boatform.get('IsActive').setValue(true); 
    this.boatSubmitted = true; 
    var Data_Temp = this.boatform.value;
    
    

    Data_Temp.PreLaunch_Date = $("#Lates_datepicker-prelaunch-date").val();
    Data_Temp.Launch_Date = $("#Lates_datepicker-launch-date").val();
    Data_Temp.SummerSeason_EDate = $("#Latest_Summer_To_Date").val();
    Data_Temp.SummerSeason_SDate = $("#Latest_Summer_From_Date").val();
    Data_Temp.WinterSeason_EDate = $("#Latest_Winter_To_Date").val();
    Data_Temp.WinterSeason_SDate = $("#Latest_Winter_From_Date").val();

    this.boatform.get('Boat_original_Owner_Manual').setValue(this.Public_Boat_original_Owner_Manual);                    
    this.boatform.get('Boat_Owner_Manual').setValue(this.public_Boat_Owner_Manual);

    
    



    this.boatform.get('PreLaunch_Date').setValue(this.string_to_Date_Convert(Data_Temp.PreLaunch_Date));
    this.boatform.get('Launch_Date').setValue(this.string_to_Date_Convert(Data_Temp.Launch_Date));
    this.boatform.get('SummerSeason_EDate').setValue(this.string_to_Date_Convert(Data_Temp.SummerSeason_EDate));
    this.boatform.get('SummerSeason_SDate').setValue(this.string_to_Date_Convert(Data_Temp.SummerSeason_SDate));
    this.boatform.get('WinterSeason_EDate').setValue(this.string_to_Date_Convert(Data_Temp.WinterSeason_EDate)); 
    this.boatform.get('WinterSeason_SDate').setValue(this.string_to_Date_Convert(Data_Temp.WinterSeason_SDate)); 
    
    
    if(this.handBook != null){
      try
      {
      this.boatform.get('Boat_HandBook_span').setValue(true);
      }
      catch{

      }
    }
    else{
      try
      {
      this.boatform.get('Boat_HandBook_span').setValue("");
      }
      catch{
        
      }

    }

   
    
    if(this.multiImg.length > 0 )
    {
      this.boatform.get('Boat_Image_span').setValue(true);
    }
    else{
      this.boatform.get('Boat_Image_span').setValue("");

    }

     if (this.boatform.invalid) {

      this.boatform.get('PreLaunch_Date').setValue("");
      this.boatform.get('Launch_Date').setValue("");
      this.boatform.get('SummerSeason_EDate').setValue("");
      this.boatform.get('SummerSeason_SDate').setValue("");
      this.boatform.get('WinterSeason_EDate').setValue(""); 
      this.boatform.get('WinterSeason_SDate').setValue(""); 
      


       return;
     }
    this.SpinnerService.show(); 
    if (this.handBook) {
      const fd = new FormData();
      fd.append("file", this.handBook);
          this.http.post<any>(`${this.url}/FileUploadSingle`, fd).subscribe(data => {  
             
            if (data.status == false) {
              
              //this.commenMessages =data.message;
              //$('#btn-CommenMessage-disp-btns').trigger('click');
              this.commenMessages = data.message;
              $('#btn-CommenMessage-save-disp-btns').trigger('click');                      
            }
               
            this.SpinnerService.hide();
            this.boatform.get('Block').setValue(true);
            var getdatas = data.data;
            this.public_SingleImageName = getdatas.filename;
            //if (this.multiImg.length != 0)
            if(getBoateImagesFind != "")
             {
              this.SpinnerService.show();
              var imgArrySplit = [];
              var filterData = sessionStorage.getItem("multifile_Ang_Addboat");
              imgArrySplit = filterData.split(",");
              const fd = new FormData();
              for (let i = 0; i < this.multiImg.length; i++) {            
                var temp_one = this.multiImg[i].name;
                var checkImg = imgArrySplit.find(X => X == temp_one);
                if (checkImg == temp_one) {
                  fd.append("files", this.multiImg[i]);
                }
              }

              if (data.status == true)
              {

                  this.http.post<any>(`${this.url}/FileUploadmany`, fd).subscribe(data => { 
                            
                    this.SpinnerService.hide();
                    this.boatform.get('Boat_Image').setValue(this.multiImg.name);
                    this.public_MultipleImageName = data.data;
                    if (data.status == false) {
                      //this.commenMessages =data.message;
                      //$('#btn-CommenMessage-disp-btns').trigger('click'); 
                      this.commenMessages = data.message;
                      $('#btn-CommenMessage-save-disp-btns').trigger('click');                    
                    }
                    if (this.handBook) {
                      var singleIMg = this.handBook.name
                    }
                    this.boatform.get('Block').setValue(true);
                    this.boatform.get('IsActive').setValue(true);

                    this.boatform.get('Boat_HandBook').setValue(this.public_SingleImageName);
                    this.boatform.get('Boat_Image').setValue(this.public_MultipleImageName);
                    this.boatform.get('Boat_originalhandBook').setValue(this.Boat_Handbook_Name);
                    this.SpinnerService.show();

                    
                   
                    if (data.status == true) {
                    
                        this.http.post<any>(`${this.url}/AddNewBoat`, this.boatform.value).subscribe(data => {             
                          
                          this.SpinnerService.hide();
                          if (data.status == true) {
                           // $('#myModal').modal({ backdrop: 'static', keyboard: false });
                          }
                          if (data.status == false) {
                            this.commenMessages =data.message;
                            $('#btn-CommenMessage-disp-btns').trigger('click');
                            //alert(data.message)
                          }
                          else if (data.status == true) {

                            this.getBoatAndSeason = data.message;


                            $('#saveBoatModel').trigger('click');
                           

                            
                          }
                        }, err => {
                        
                        })

                    }



                  }, err => {

                    this.commenMessages ="Images Empty";

                    $('#btn-CommenMessage-save-disp-btns').trigger('click');

                  // alert("Images Empty");
                   //location.reload();
                  
                  })
              }
            }
            else{
                //.....................

                this.boatform.get('Block').setValue(true);
                    this.boatform.get('IsActive').setValue(true);

                    this.boatform.get('Boat_HandBook').setValue(this.public_SingleImageName);
                   // this.boatform.get('Boat_Image').setValue(this.public_MultipleImageName);
                    this.boatform.get('Boat_originalhandBook').setValue(this.Boat_Handbook_Name);
                    this.SpinnerService.show();

                   
                this.http.post<any>(`${this.url}/AddNewBoat`, this.boatform.value).subscribe(data => {             
                          
                  this.SpinnerService.hide();
                  if (data.status == true) {
                   // $('#myModal').modal({ backdrop: 'static', keyboard: false });
                  }
                  if (data.status == false) {
                    this.commenMessages =data.message;
                    $('#btn-CommenMessage-disp-btns').trigger('click');
                    //alert(data.message)
                  }
                  else if (data.status == true) {

                    this.getBoatAndSeason = data.message;


                    $('#saveBoatModel').trigger('click');
                   

                    
                  }
                }, err => {
                
                })



            }
          }, err => {

            this.commenMessages ="Boat Handbook Empty";

             $('#btn-CommenMessage-save-disp-btns').trigger('click');

            
          
          })
    }
    else{


      //if (this.multiImg.length != 0)
      if(getBoateImagesFind != "")
       {
        this.SpinnerService.show();
        var imgArrySplit = [];
        var filterData = sessionStorage.getItem("multifile_Ang_Addboat");
        imgArrySplit = filterData.split(",");
        const fd = new FormData();
        for (let i = 0; i < this.multiImg.length; i++) {            
          var temp_one = this.multiImg[i].name;
          var checkImg = imgArrySplit.find(X => X == temp_one);
          if (checkImg == temp_one) {
            fd.append("files", this.multiImg[i]);
          }
        }
            this.http.post<any>(`${this.url}/FileUploadmany`, fd).subscribe(data => { 
                      
              this.SpinnerService.hide();
              this.boatform.get('Boat_Image').setValue(this.multiImg.name);
              this.public_MultipleImageName = data.data;
              if (data.status == false) {
                //this.commenMessages =data.message;
                //$('#btn-CommenMessage-disp-btns').trigger('click'); 
                this.commenMessages = data.message;
                $('#btn-CommenMessage-save-disp-btns').trigger('click');                    
              }
              if (this.handBook) {
                var singleIMg = this.handBook.name
              }
              this.boatform.get('Block').setValue(true);
              this.boatform.get('IsActive').setValue(true);

              this.boatform.get('Boat_HandBook').setValue(this.public_SingleImageName);
              this.boatform.get('Boat_Image').setValue(this.public_MultipleImageName);
              this.boatform.get('Boat_originalhandBook').setValue(this.Boat_Handbook_Name);
              this.SpinnerService.show();

                          
              if (data.status == true) {
              
                  this.http.post<any>(`${this.url}/AddNewBoat`, this.boatform.value).subscribe(data => {             
                    
                    this.SpinnerService.hide();
                    if (data.status == true) {
                     // $('#myModal').modal({ backdrop: 'static', keyboard: false });
                    }
                    if (data.status == false) {
                      this.commenMessages =data.message;
                      $('#btn-CommenMessage-disp-btns').trigger('click');
                      //alert(data.message)
                    }
                    else if (data.status == true) {

                      this.getBoatAndSeason = data.message;


                      $('#saveBoatModel').trigger('click');
                     

                      
                    }
                  }, err => {
                  
                  })

              }



            }, err => {

              this.commenMessages ="Images Empty";

              $('#btn-CommenMessage-save-disp-btns').trigger('click');
            
            })
        
      }
      else{
      
      this.http.post<any>(`${this.url}/AddNewBoat`, this.boatform.value).subscribe(data => {             
                          
        this.SpinnerService.hide();
        if (data.status == true) {
         // $('#myModal').modal({ backdrop: 'static', keyboard: false });
        }
        if (data.status == false) {
          this.commenMessages =data.message;
          $('#btn-CommenMessage-disp-btns').trigger('click');
          //alert(data.message)
        }
        else if (data.status == true) {

          this.getBoatAndSeason = data.message;


          $('#saveBoatModel').trigger('click');
         

          
        }
      }, err => {
      
      })

    }

    }


  }

  singleUploadImage_old(imageFor) {
    if (this.handBook) {
      const fd = new FormData();
      fd.append("file", this.handBook);
      this.http.post<any>(`${this.url}/FileUploadSingle`, fd).subscribe(data => {
        this.boatform.get('Block').setValue(true);
      }, err => {
       
      })
    }
  }



  createForm() {
    this.form = this.fb.group({
      Boat_Type: new FormControl('', [Validators.required,]),
      Block: new FormControl('', []),
      IsActive: new FormControl('', []),
      Type_Description: new FormControl('', [Validators.required,]),
    });
  }

  imageForm() {
    this.imageForms = this.fb.group({
      image: new FormControl('', [Validators.required,]),
    });
  }

  seasonForm() {
    this.seasonForms = this.fb.group({
      Boat_Name: new FormControl('', [Validators.required,]),
      Boat_Id: new FormControl('', []),
      Owner_Name: new FormControl('', []),
      Season_Type: new FormControl('', [Validators.required,]),
      Season_SDate: new FormControl('', [Validators.required,]),
      Season_EDate: new FormControl('', [Validators.required,]),
    });
  }

  manageOwnerForm() {
    this.manageOwnerForms = this.fb.group({
      Boat_Name: new FormControl('', [Validators.required,]),
      Boat_Type: new FormControl('', [Validators.required,]),
      Owner_Name: new FormControl('', [Validators.required,]),
      // Owner_id: new FormControl('', [Validators.required,]),
      Owners_Allowed: new FormControl('', [Validators.required,]),
      shareAllocation: new FormControl('', [Validators.required,]),
      Block: new FormControl('', []),
      IsActive: new FormControl('', []),
      season_id: new FormControl('', []),
    });
  }

  createBoatForm() {
    this.boatform = this.fb.group({
      Boattype_id: new FormControl('', [Validators.required,]),//
      Boattype_Name: new FormControl('', [Validators.required,]),//
      Location_Name: new FormControl('', [Validators.required,]),//
      Boat_Number: new FormControl('', [Validators.required,]),//
      Boat_Name: new FormControl('', [Validators.required,]),//
      Boat_Description: new FormControl('', []),//
      Owners_Allowed: new FormControl('', [Validators.required,]),//
      Location_Id: new FormControl('', [Validators.required,]), //
      Boat_Facility: new FormControl('', []),//
      Launch_Date: new FormControl('', [Validators.required,]),//
      PreLaunch_Date: new FormControl('', [Validators.required,]),//
      Boat_Status: new FormControl('', [Validators.required,]),//
      SummerSeason_SDate: new FormControl('', [Validators.required,]),//
      SummerSeason_EDate: new FormControl('', [Validators.required,]),//
      WinterSeason_SDate: new FormControl('', [Validators.required,]),//
      WinterSeason_EDate: new FormControl('', [Validators.required,]),//

      //SummeSeason_EDate

      Boat_Image_span: new FormControl('', []),
      Boat_HandBook_span: new FormControl('', []),
      Boat_HandBook_span2: new FormControl('', []),

      Boat_original_Owner_Manual: new FormControl('', []),
      Boat_Owner_Manual: new FormControl('', []),

      Boat_Image: new FormControl('', []),
      Boat_HandBook: new FormControl('', []),
      Block: new FormControl('', []),
      IsActive: new FormControl('', []),
      Boat_originalhandBook: new FormControl('', [])
    });
  }

  get bf() { return this.boatform.controls; }
  get sf() { return this.seasonForms.controls; }
  get mof() { return this.manageOwnerForms.controls; }

  onDeSelect(id) {  
    this.boatform.get('Boattype_id').setValue('');
    this.boatform.get('Boattype_Name').setValue('');
  }

  getBoatTypeId(id) {   
    this.boatform.get('Boattype_id').setValue(id._id);
    this.boatform.get('Boattype_Name').setValue(id.Boat_Type);
  }

  goToViewPage() {
   
    //Change all boat url  for add boat Done By Alagesan on 25.06.2021	
    
    this.router.navigate(['/all-boats/']);
  }

  getLoctionTypeId(id) {
    for (let i = 0; i < this.loctions.length; i++) {
      if (this.loctions[i]._id == id) {        
        this.boatform.get('Location_Name').setValue(this.loctions[i].Boat_Location);
      }
    }
  }
  
  get f() { return this.form.controls; }

  addBoatType() {
    this.submitted = true;
    $("#id-button-Add-boat").attr("disabled", true);
    if (this.form.invalid) {
      $("#id-button-Add-boat").attr("disabled", false);
      return;
    }
    this.form.get('Block').setValue("true");
    this.form.get('IsActive').setValue("true");
    this.http.post<any>(`${this.url}/AddBoatType`, this.form.value).subscribe(data => {
      if (data.status == false) {

        this.commenMessages =data.message;
        $('#btn-CommenMessage-disp-btns').trigger('click');

        //alert(data.message)
        $("#id-button-Add-boat").attr("disabled", false);
      }
      else if (data.status == true) {
        $('#error-disp-btns').trigger('click');
        this.form.reset()
        $("#pop-up-btn").trigger('click')
      }
    }, err => {
      $("#id-button-Add-boat").attr("disabled", false);     
    })
  }

  locationReaload() {
    location.reload();
  }

  lunchdateChange(newValue) {

    this.commenMessages =newValue;
    $('#btn-CommenMessage-disp-btns').trigger('click');
    //alert(newValue);
  }

  saveManageOwner() {
    this.manageOwnerSubmitted = true;
    if (this.manageOwnerForms.invalid) {
      return;
    }
    this.manageOwnerForms.get('season_id').setValue(this.season_id);
    this.http.post<any>(`${this.OwnerUrl}/ManageOwner`, this.manageOwnerForms.value).subscribe(data => {
      if (data.status == false) {
        //alert(data.message)
        this.commenMessages =data.message;

        $('#btn-CommenMessage-disp-btns').trigger('click');

      }
      else if (data.status == true) {
        this.getManageOwner = data.message
        $('#manageOwnerModel').trigger('click');
        var obj = {
          boatid: this.boat_id,
          Owner_Name: this.manageOwnerForms.get('Owner_Name').value
        }
        this.http.post<any>(`${this.OwnerUrl}/GetSeasonDetailsById`, obj).subscribe(data => {
          this.seasonList = data.Data
          if (data.status == false) {

          }
          else if (data.status == true) {
            this.viewOwners = data.data
          }
        }, err => {
         
        })
      }
    }, err => {
     
    })
  }

  saveSeason() {
    this.seasonForms.get('Season_SDate').setValue(this.fromDate);
    this.seasonForms.get('Season_EDate').setValue(this.toDate);
    this.seasonForms.get('Boat_Id').setValue(this.boat_id);
    this.seasonSubmitted = true;
    if (this.seasonForms.invalid) {
      return;
    }  
    this.http.post<any>(`${this.url}/AddSeason`, this.seasonForms.value).subscribe(data => {
      if (data.status == false) {
        this.getBoatAndSeason = data.message
        $('#boatAndSeason').trigger('click');
      }
      else if (data.status == true) {
        this.getBoatAndSeason = data.message
        $('#boatAndSeason').trigger('click');
        this.getSeason = data['response']
        this.season_id = this.getSeason._id
        this.manageOwnerForms.get('Boat_Name').setValue(this.resultBoatType);
        this.manageOwnerForms.get('Boat_Type').setValue(this.Boattype_Name);
        this.manageOwnerForms.get('Owners_Allowed').setValue(this.ownersAllowed);
        this.manageOwnerForms.get('IsActive').setValue(true);
        this.manageOwnerForms.get('Block').setValue(true);
        var math = this.ownersAllowed
        var maths = 100 / math;
        this.manageOwnerForms.get('shareAllocation').setValue(maths + "%");        
      }
    }, err => {
     
    })
  }

  getOwners() {
    this.http.get<any>(`${this.OwnerUrl}/GetOwners`).subscribe(data => {
      this.owners = data['response']
    }, err => {
    })
  }

  getBoats() {
    this.http.get<any>(`${this.OwnerUrl}/GetBoat`).subscribe(data => {
      this.boats = data['response']
      if (this.resultBoatType) {
        this.seasonForms.get('Boat_Name').setValue(this.resultBoatType);
      }
    }, err => {
    })
  }

  getLoction() {
    this.http.get<any>(`${this.url}/GetLocation`).subscribe(data => {
      this.loctions = data['response']
    }, err => {
    })
  }

  getBoatType() {
    this.http.get<any>(`${this.url}/GetBoatType`).subscribe(data => {
      this.boatTypes = data['response']
    }, err => {
    })
  }

   string_to_Date_Convert(dateString){ 
        
    var dateArray = dateString.split("/");
    var dateObj = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`);
  
    return this.getFormattedDate_second(dateObj)//dateObj;

  }

   getFormattedDate_second(dateVal) {
     
    var newDate = new Date(dateVal);

    var sMonth = this.padValue(newDate.getMonth() + 1);
    var sDay = this.padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = this.padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = Number(sHour);

    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = 12;
    }

    sHour = this.padValue(sHour);

    //return sDay + "-" + sMonth + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
    return sYear + "/" + sMonth + "/" + sDay;

}

 padValue(value) {
  return (value < 10) ? "0" + value : value;

}


}

