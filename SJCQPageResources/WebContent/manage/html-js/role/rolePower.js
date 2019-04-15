/**
 * 角色权限js author lxw 2018/01/23
 */

var ROLEID_ = "";// 序号
var MODULEOBJ_ = {};// 定义模块树
var USEROBJ_ = {};// 定义部门树
var PARAM = {}; // 前一个页面的参数对象
var MAIN_PAGE_WINDOW = {};// 前一个页面对象
$(document).ready(
		function() {
			checksessoin();
			PARAM = GetParamByRequest();
			ROLEID_ = PARAM.roleId;
			MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"
					+ PARAM.MAIN_PAGE_ID_).contentWindow;
			findRolePowerById(ROLEID_);
			// setHeight();
		});
/**
 * 修改html的高度
 */
function setHeight() {
	setIframeHeight("role_power_content", MODULEID_);
}
/**
 * 获取请求头的参数
 * 
 * @returns
 */
function GetRequest() {
	var url = location.href; // 获取url中"?"符后的字串
	var num = url.indexOf("?")
	str = url.substr(num + 1); // 取得所有参数 stringvar.substr(start [, length ]
	var name, value;
	var arr = str.split("&"); // 各个参数放到数组里
	for (var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if (num > 0) {
			name = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			if (name == "roleId") {
				ROLEID_ = value;
			}
		}
	}
}
/**
 * 加载角色权限信息
 * 
 * @param roleId
 */
function findRolePowerById(roleId) {

	$.ajax({
		url : "/sjcq/manage/role/findRolePowerById", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			id : roleId
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			MODULEOBJ_ = data.module;
			USEROBJ_ = data.user;
			var obj = data.role;
			$("#roleId").val(obj.roleId);
			$("#roleCode").val(obj.roleCode);
			$("#roleName").val(obj.roleName);
			$("input:radio[value='" + data.isUse + "']")
					.attr('checked', 'true');
			$("#roleRemark").val(obj.roleRemarks);
			initModuleInfo(MODULEOBJ_);
			initDepInfo(USEROBJ_);
			var userList = obj.users;
			var owner = "";
			$.each(userList, function(key, val) {
				if (val.userId != 0) {
					owner = owner + "," + val.userName + "\r\n";
				}
			});
			if (owner.length > 0) {
				$("#haveUsers").val(owner.substring(1));
			} else {
				$("#haveUsers").val(owner);
			}

			var moduleList = obj.modules;
			var owner = "";
			$.each(moduleList, function(key, val) {
				if (val.modId != 0) {
					owner = owner + "," + val.modName + "\r\n";
				}
			});
			if (owner.length > 0) {
				$("#haveModule").val(owner.substring(1));
			} else {
				$("#haveModule").val(owner);
			}

			// $box.promptBox(JSON.stringify(obj));
		},
		error : function() {
			$box.promptBox("服务器错误！");
		}
	});
}

/**
 * 加载功能模块树图
 * 
 * @author George
 * @param treeData
 */
function initModuleInfo(treeData) {
	var zNodes = null;
	// tree的相关设置
	var setting = {
		view : {
			dblClickExpand : true,
			showLine : false,
			selectedMulti : false
		},
		check : {
			enable : true,
			chkStyle : "checkbox",
			nocheckInherit : false
		},
		data : {
			key : {
				url : "noUrl"
			},
			simpleData : {
				enable : true,
				idKey : "id",
				pIdKey : "parentId",
				rootPId : ""
			}
		},
		callback : {
			onCheck : function(event, treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj("moduleTree");
				var checkedNodes = zTree.getCheckedNodes(true);
				var owner = "";
				$.each(checkedNodes, function(key, val) {
					if (val.id != 0) {
						owner = owner + "," + val.name + "\r\n";
					}
				});
				if (owner.length > 0) {
					$("#haveModule").val(owner.substring(1));
				} else {
					$("#haveModule").val(owner);
				}
			}
		}
	};
	var t = $("#moduleTree");
	t = $.fn.zTree.init(t, setting, treeData);
	var zTree = $.fn.zTree.getZTreeObj("moduleTree");
	zTree.expandAll(true);
}

/**
 * 加载机构用户树图
 * 
 * @author George
 * @param treeData
 */
function initDepInfo(treeData) {
	var zNodes = null;
	// tree的相关设置
	var setting = {
		view : {
			dblClickExpand : true,
			showLine : false,
			selectedMulti : false
		},
		check : {
			enable : true,
			chkStyle : "checkbox",
			nocheckInherit : false
		},
		data : {
			key : {
				url : "noUrl"
			},
			simpleData : {
				enable : true,
				idKey : "id",
				pIdKey : "parentId",
				rootPId : ""
			}
		},
		callback : {
			onCheck : function(event, treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj("userTree");
				var checkedNodes = zTree.getCheckedNodes(true);
				var owner = "";
				$.each(checkedNodes, function(key, val) {
					if (val.id != 0) {
						owner = owner + "," + val.name + "\r\n";
					}
				});
				if (owner.length > 0) {
					$("#haveUsers").val(owner.substring(1));
				} else {
					$("#haveUsers").val(owner);
				}
			}
		}
	};
	var t = $("#userTree");
	t = $.fn.zTree.init(t, setting, treeData);
	var zTree = $.fn.zTree.getZTreeObj("userTree");
	zTree.expandAll(true);
}
/**
 * 改变权限
 */
function changePower() {

	$box.promptSureBox("权限变更后无法恢复，只能再次设置，请慎重！", "sureChangePower", "");
}
/**
 * 确认改变权限
 */
function sureChangePower() {
	var obj = {};

	var zTree1 = $.fn.zTree.getZTreeObj("moduleTree");
	var checkedNodes1 = zTree1.getCheckedNodes(true);
	var moduleIds = "";
	$.each(checkedNodes1, function(key, val) {
		if (val.id != 0) {
			moduleIds = moduleIds + "," + val.id;
		}
	});
	obj.moduleIds = moduleIds.substring(1)

	var zTree = $.fn.zTree.getZTreeObj("userTree");
	var checkedNodes = zTree.getCheckedNodes(true);
	var userIds = "";
	$.each(checkedNodes, function(key, val) {
		if (val.id != 0) {
			userIds = userIds + "," + val.id;
		}
	});
	obj.userIds = userIds.substring(1)

	var roleId = $("#roleId").val();
	obj.roleId = roleId;

	$.ajax({
		url : "/sjcq/manage/role/changeRolePower", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {

			$box.promptBox(data.resultInfo);
			if (data.resultStatus) {
				findRolePowerById(roleId);
			}
		},
		error : function() {
			$box.promptBox("服务器错误！");
		}
	});
}
/**
 * 重置
 */
function restTableData() {
	initModuleInfo(MODULEOBJ_);
	initDepInfo(USEROBJ_);
	var zTree1 = $.fn.zTree.getZTreeObj("moduleTree");
	var checkedNodes1 = zTree1.getCheckedNodes(true);
	var owner1 = "";
	$.each(checkedNodes1, function(key, val) {
		if (val.id != 0) {
			owner1 = owner1 + "," + val.name + "\r\n";
		}
	});
	if (owner1.length > 0) {
		$("#haveModule").val(owner1.substring(1));
	} else {
		$("#haveModule").val(owner1);
	}
	var zTree = $.fn.zTree.getZTreeObj("userTree");
	var checkedNodes = zTree.getCheckedNodes(true);
	var owner = "";
	$.each(checkedNodes, function(key, val) {
		if (val.id != 0) {
			owner = owner + "," + val.name + "\r\n";
		}
	});
	if (owner.length > 0) {
		$("#haveUsers").val(owner.substring(1));
	} else {
		$("#haveUsers").val(owner);
	}
}

/**
 * 返回角色管理页面
 */
function returnRoletManage() {
	window.location.href = "../../sjcq/manage/role/roleManage.html";
}