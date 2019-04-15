/**
 * 图片详情
 */
var photoDetail = {
	picXh : '',
	PARAM : {},
	MODULEID_ : '',
	auditUuid : '',
	tjXh:'',
	init : function() {
		PARAM = GetParamByRequest();
		MODULEID_ = PARAM.MODULEID_;
		picXh = PARAM.picXh;
		auditUuid = PARAM.auditUuid;
		tjXh=PARAM.tjXh;
		if(tjXh){//显示图集信息
			$("#tj_pic_list").show();
			$("#tj_info").show();
			$("#pic_info").hide();
			photoDetail.search_tj();
		}else{//显示图片信息
			$("#tj_pic_list").hide();
			$("#tj_info").hide();
			$("#pic_info").show();
			photoDetail.search();
		}
	},
	search_tj:function(){
		$.ajax({
			url : "/sjcq/manage/audit/getAuditAndPhotoInfo", // 请求的url地址
			type : "post", // 请求方式
			dataType : "json", // 返回格式为json
			async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				Xh : tjXh,auditUuid:auditUuid
			}, // 参数值
			success : function(data) {
				console.log(data);
				$("#tjLyljm").attr(
						"src",
						index_nav.PICURI+ data.newData.tjFmlj);// 带水印的图片
				$("#tj_mc_2").text(data.newData.tjMc==null?"":data.newData.tjMc);
				$("#tj_mc_1").text(data.newData.tjMcOld==null?"":data.newData.tjMcOld);
				$("#tj_remark_1").text(data.newData.tjRemarkOld==null?"":data.newData.tjRemarkOld);
				$("#tj_remark_2").text(data.newData.tjRemark==null?"":data.newData.tjRemark);
				$("#tj_syz_1").text(data.newData.tjSyzOld==null?"":data.newData.tjSyzOld);
				$("#tj_syz_2").text(data.newData.tjSyz==null?"":data.newData.tjSyz);
				$("#tj_scz_1").text(data.newData.tjSczOld==null?"":data.newData.tjSczOld);
				$("#tj_scz_2").text(data.newData.tjScz==null?"":data.newData.tjScz);
				$("#tj_scsj_1").text(data.newData.tjScsjOld==null?"":timecheck(data.newData.tjScsjOld));
				$("#tj_scsj_2").text(data.newData.tjScsj==null?"":timecheck(data.newData.tjScsj));
				$("#tj_mj_1").text(data.newData.tjMjOld==1?"公开":"非公开");
				$("#tj_mj_2").text(data.newData.tjMj==1?"公开":"非公开");
				var reg = new RegExp("@","g");//g,表示全部替换.
				$("#tj_gjz_1").text(data.newData.tjGjzOld==null?"":data.newData.tjGjzOld.replace(reg,"  "));
				$("#tj_gjz_2").text(data.newData.tjGjz==null?"":data.newData.tjGjz.replace(reg,"  "));
				var oldSort="";
				var newSort="";
				if(data.newData.typeOneOld){
					oldSort=data.newData.typeOneOld;
					if(data.newData.typeTwoOld){
						oldSort+="/"+data.newData.typeTwoOld;
					}
					if(data.newData.typeThreeOld){
						oldSort+="/"+data.newData.typeThreeOld;
					}
					if(data.newData.typeFourOld){
						oldSort+="/"+data.newData.typeFourOld;
					}
					if(data.newData.typeFiveOld){
						oldSort+="/"+data.newData.typeFiveOld;
					}
				}
				if(data.newData.typeOne){
					newSort=data.newData.typeOne;
					if(data.newData.typeTwo){
						newSort+="/"+data.newData.typeTwo;
					}
					if(data.newData.typeThree){
						newSort+="/"+data.newData.typeThree;
					}
					if(data.newData.typeFour){
						newSort+="/"+data.newData.typeFour;
					}
					if(data.newData.typeFive){
						newSort+="/"+data.newData.typeFive;
					}
				}
				$("#tj_sort_1").text(oldSort);
				$("#tj_sort_2").text(newSort);
				photoDetail.search_tj_img(tjXh);
				return data;
			},
			error : function() {
				layer.msg('查询加载失败！');
			}
		})
	},
	 /**
     * 查询图集下的图片
     * @param uuid 图集序号
     */
    search_tj_img:function(uuid){
        //获取图片列表
        var jsonstring = JSON.stringify({table:"d_photo_pic",term:"",tj_xh:uuid});
        in_search.search(1,100,"id","desc",jsonstring,function(data){
            console.log(data);
            var html = "";
            $(data.rows).each(function(i,row){
                html = html + '<li data-id="'+row.pic_jg+'">';
                html = html + '<div class="picn">';
                html = html + '<div class="picn_nbx">';
                html = html + '<p onclick="photoDetail.search_img(\''+row.pic_xh+'\')"><img src="'+index_nav.PICURI+row.pic_lylys+'"></p>';
                html = html + '<div class="ed_sel_ok"><i class="ico ico22"></i></div>';
                html = html + '</div>';
                html = html + '<div class="vjg">￥'+row.pic_jg+'</div>';
                html = html + '</div>';
                html = html + '</li>';   
            })
            $("#tj_pic").html(html);
        });
    },
	// 添加浏览量
	search : function() {
		$.ajax({
			url : "/sjcq//manage/audit/getAuditAndPhotoInfo", // 请求的url地址
			type : "post", // 请求方式
			dataType : "json", // 返回格式为json
			async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				Xh : picXh,auditUuid:auditUuid
			}, // 参数值
			success : function(data) {

				console.log(data);

				$("#picLyljm").attr(
						"src",
						index_nav.PICURI+ data.newData.picLyljm);// 带水印的图片
				$("#pic_mc_2").text(data.newData.picMc==null?"":data.newData.picMc);
				$("#pic_mc_1").text(data.newData.picMcOld==null?"":data.newData.picMcOld);
				$("#pic_remark_1").text(data.newData.picRemarkOld==null?"":data.newData.picRemarkOld);
				$("#pic_remark_2").text(data.newData.picRemark==null?"":data.newData.picRemark);
				$("#picfremark_1").text(data.newData.picFRemarkOld==null?"":data.newData.picFRemarkOld);
				$("#picfremark_2").text(data.newData.picFRemark==null?"":data.newData.picFRemark);
				$("#pic_dd_1").text(data.newData.picDdOld==null?"":data.newData.picDdOld);
				$("#pic_dd_2").text(data.newData.picDd==null?"":data.newData.picDd);
				$("#pic_syz_1").text(data.newData.picSyzOld==null?"":data.newData.picSyzOld);
				$("#pic_syz_2").text(data.newData.picSyz==null?"":data.newData.picSyz);
				$("#pic_sysj_1").text(data.newData.picSysjOld==null?"":timecheck(data.newData.picSysjOld));
				$("#pic_sysj_2").text(data.newData.picSysj==null?"":timecheck(data.newData.picSysj));
				$("#pic_mj_1").text(data.newData.picMjOld==1?"公开":"非公开");
				$("#pic_mj_2").text(data.newData.picMj==1?"公开":"非公开");
				$("#pic_type_1").text(data.newData.picTypeOld==0?"横幅":"竖幅");
				$("#pic_type_2").text(data.newData.picType==0?"横幅":"竖幅");
				var reg = new RegExp("@","g");//g,表示全部替换.
				$("#pic_gjz_1").text(data.newData.picGjzOld==null?"":data.newData.picGjzOld.replace(reg,"  "));
				$("#pic_gjz_2").text(data.newData.picGjz==null?"":data.newData.picGjz.replace(reg,"  "));
				var oldSort="";
				var newSort="";
				if(data.newData.typeOneOld){
					oldSort=data.newData.typeOneOld;
					if(data.newData.typeTwoOld){
						oldSort+="/"+data.newData.typeTwoOld;
					}
					if(data.newData.typeThreeOld){
						oldSort+="/"+data.newData.typeThreeOld;
					}
					if(data.newData.typeFourOld){
						oldSort+="/"+data.newData.typeFourOld;
					}
					if(data.newData.typeFiveOld){
						oldSort+="/"+data.newData.typeFiveOld;
					}
				}
				if(data.newData.typeOne){
					newSort=data.newData.typeOne;
					if(data.newData.typeTwo){
						newSort+="/"+data.newData.typeTwo;
					}
					if(data.newData.typeThree){
						newSort+="/"+data.newData.typeThree;
					}
					if(data.newData.typeFour){
						newSort+="/"+data.newData.typeFour;
					}
					if(data.newData.typeFive){
						newSort+="/"+data.newData.typeFive;
					}
				}
				$("#pic_sort_1").text(oldSort);
				$("#pic_sort_2").text(newSort);
				return data;
			
			},
			error : function() {
				layer.msg('查询加载失败！');
			}
		})
	}
}
