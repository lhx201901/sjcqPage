$(function(){
	// 获取得奖项情况
	$.ajax({
		url : "/sjcq/manage/getWinAwardsCaseItems",
		type : "POST",
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			activeUUid : atuid
		},
		dataType : "JSON",
		success : function(data) {
			var html = "";
			if(data.length != 0){
				html +="<tr>";
				html +="<th>获奖人</th>";
				html +="<th>获奖作品</th>";
				html +="<th>获奖名次</th>";
				html +="</tr>";
				$("#winAwards").append(html);
				for(var i=0;i<data.length;i++){
					$("#winAwards").append("<tr><td>"+data[i].personName+"</td>"+ "<td>"+data[i].picMc+"</td>"+"<td>"+data[i].itemName+"</td></tr>");
				}
			}else{
				html +="<tr>";
				html +="<th colspan='3'>暂无获奖信息</th>";
				html +="</tr>"
			}
			
		},
		error : function() {
			layer.msg('获奖异常！请联系管理员');
		}
	});
	
});