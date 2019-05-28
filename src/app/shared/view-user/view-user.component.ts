import { Component, OnInit } from '@angular/core';
import { MTservice } from '../../mt-services';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Http, Headers, RequestOptions, ResponseContentType  } from '@angular/http';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
bulks:any = [
    {value: 'activate', viewValue: 'Activate'},
    {value: 'deactivate', viewValue: 'De-activate'},
    {value: 'delete', viewValue: 'Delete'}
  ];

envs:any = [
    {value: 'bml_users', viewValue: 'admin'},
    {value: 'bml_teacher', viewValue: 'Teachers'},
    {value: 'bml_student', viewValue: 'Students'}
];  
	data:any = {};
	displayedColumns: string[] = ['bulk', 'id', 'dp', 'first name', 'last name', 'email', 'status', 'action'];

  constructor(public mtServ: MTservice, public http:Http) { 

  this.mtServ = mtServ;
  this.data.users ='';
  this.data.loader = false;
  this.data.bulk = false;
  this.data.bulkTrig = false;
  this.data.bulkItems = '';
  this.data.selected;

  this.data.q = '';
  this.data.qResult = '';
  this.data.qFound = false;
  this.data.search = false;

  this.data.errorCard = false;

  this.data.pageIndex = 0;

  this.data.length;
  this.data.pageSize = 5;
  this.data.pageSizeOptions = [5, 10, 25, 100];

  this.data.env = 'bml_users';


  }
  state: string = "smaller";
   animate() {
      this.state= this.state == 'larger' ? 'smaller' : 'larger';
   }

  ngOnInit(pindex = 0, psize = this.data.pageSize, cardloader = true) {

    this.data.search = false;
		this.data.loader = cardloader;
		var pageIndexData = JSON.stringify({'pLimit': psize, 'pIndex':pindex,'role': 2});
		var apiurl = this.mtServ.apiLink+'account/users'; 
		this.mtServ.MtPost(apiurl,pageIndexData,'application/json').then(data => {
        		this.data.loader = false;
            this.data.placeLoader = false;
		  		  
            console.log(data);
            if(data['status'] == 0 && !data['ok']){
              this.data.errorCard = true;
            }
            else{
              this.data.errorCard = false;
              this.data.users = data['limited_users'];
              this.data.length = data['user_count'];
            }
		});
  }

  onPaginateChange(event){
  		//alert(event.pageSize);
      this.data.pageIndex = event.pageIndex;
      this.data.pageSize = event.pageSize;
  		this.ngOnInit(event.pageIndex, event.pageSize,true);
  }

  changeState(uid,status){
   
    this.mtServ.changeUserState(uid,status,false,this.data.env).then(data => {
      this.ngOnInit(this.data.pageIndex,this.data.pageSize,false);
    });
  }

  bulkCheck(){
    
    //alert(da);
    if(this.data.bulk){
      this.data.bulk = false;
    }
    else{
      this.data.bulk = true;
    }
    

   
  }
  
  bulkAction(status){
    
    var itemArray = [];
    
     $('input:checkbox[name=bulkItem]:checked').each(function() 
      {   
        //var itemKeyArray = {};
        //itemKeyArray['u_id'] = $(this).val();
        itemArray.push($(this).val());
      });
    //console.log(itemArray);
    if(itemArray.length <= 0){
      this.mtServ.triggerSnack('Select atleast 1 user.');
    }
    else{
      this.mtServ.changeUserState(itemArray,status,true,this.data.env).then(data => {
      this.ngOnInit(this.data.pageIndex,this.data.pageSize,false);
      this.mtServ.triggerSnack(itemArray.length + ' Users Affected.');
      this.data.bulk = false;
      this.data.selected = undefined;
      
      });
    }
    
  }

  mtSearch(){
      
      this.data.loader = true;
      var apiurl = this.mtServ.apiLink+'account/search'; 
      this.data.qFound = false;
      let searchQuery = JSON.stringify({'q':this.data.q});
      const searchData = new FormData();
      searchData.append('data',btoa(searchQuery));
      this.mtServ.MtPost(apiurl,searchData,'').then(data => {
          this.data.qFound = true;
          this.data.qResult = data;
          this.data.search = true;
          this.data.loader = false;
      });
  }

  changeEnv(env){
    this.data.env = env;
    this.ngOnInit();
  }

  public mtClear(){
    this.data.q = '';
    this.ngOnInit();
  }

  public downloadReport(limit,id){
    this.mtServ.MtPlaceLoader('download-',id,true,false);
    var apiurl = this.mtServ.apiLink+'reports';
    var postData;
    if(limit){
      postData = JSON.stringify({'pLimit': this.data.pageSize, 'pIndex':this.data.pageIndex,'env': this.data.env, 'type': 'limit'});
    }
    else{
      postData = JSON.stringify({'env': this.data.env, 'type': 'all'});
    }

    this.mtServ.downloadFile(apiurl,postData,'users','xlsx').then(res =>{
      this.mtServ.MtPlaceLoader('download-',id,false,false,'<span class="fa fa-file-excel-o"></span>');
        var url = window.URL.createObjectURL(res['data']);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res['filename'];
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
    });
  }

}

/*

public downloadFile(){
    var apiurl = 'http://127.0.0.1/ci/index.php/exl';
    this.mtServ.MtGet(apiurl,'').then(data => {
        console.log(data);
    });

    return this.http
    .get('http://127.0.0.1/ci/index.php/exl', {
      responseType: ResponseContentType.Blob,
    })
    .map(res => {
      return {
        filename: 'exl.xlsx',
        data: res.blob()
      };
    })
    .subscribe(res => {
        console.log('start download:',res);
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });
  }

*/
