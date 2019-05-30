<template>
    <div>
        <!-- 返回上一级 -->
        <div>
            <a href="#" @click.prevent="go_back">
                <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
            </a>
            项目：{{this.$route.query.projectName}}
        </div><br>
        <!-- 测试报告 -->
        <div>
             <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="平台版本" name="first">
                    <el-form label-position="right" label-width="150px" :model="formInline">
                        <el-form-item label="量产云平台">
                            <el-col :span="4">
                                <el-input v-model="formInline.user" placeholder="如:V1.0 (必填)" width="100"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="电流板">
                            <el-col :span="4">
                                <el-input v-model="formInline.user" placeholder="如:V1.0.1_190112 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="MPTool">
                            <el-col :span="4">
                                <el-input v-model="formInline.user" placeholder="如:V1.2.0.4 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="离线Key授权工具">
                            <el-col :span="4">
                                <el-input v-model="formInline.user" placeholder="如:V1.1.3.0 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="syncAgent">
                            <el-col :span="4">
                                <el-input v-model="formInline.user" placeholder="如:V0.0.11 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="TransferStation">
                            <el-col :span="4">
                                <el-input v-model="formInline.user" placeholder="如:V0.0.01 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="Release Note" name="second">
                    <el-input
                        type="textarea"
                        :rows="15"
                        v-model="formInline.user"
                        placeholder="请输入Release Note (必填)">
                    </el-input>
                </el-tab-pane>
                <el-tab-pane label="测试结果" name="third">
                    <el-collapse v-model="activeTestName" accordion>
                        <el-collapse-item title="权限测试" name="1">
                             <el-form label-position="right" label-width="130px" :model="formInline" inline>
                                <el-form-item label="产品-产品经理">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="项目-产品经理">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="产品-研发工程师">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="项目-研发工程师">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="产品-测试工程师">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="项目-测试工程师">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="产品-PMC">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="项目-PMC">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="产品-产线工程师">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="项目-产线工程师">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="产品-项目工程师">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="项目-项目工程师">
                                    <el-col :span="10">
                                       <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <el-collapse-item title="功能测试" name="2">
                            <el-form label-position="right" label-width="130px" :model="formInline" inline>
                                <el-form-item label="收集生产日志文件">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <!-- 收集生产日志文件测试明细 -->
                                <el-table
                                    :data="collectLogFile"
                                    border
                                    style="width: 100%;">
                                    <el-table-column prop="testInfo" label="测试内容" width="180">
                                    </el-table-column>
                                    <el-table-column prop="step" label="测试步骤">
                                        <template slot-scope="scope">
                                            <div v-for="(item,index) in scope.row.step" :key="index">
                                                {{index+1}}.{{item}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="result" label="测试结果">
                                        <template slot-scope="scope">
                                             <el-col :span="10">
                                                <el-select v-model="scope.row.result" placeholder="必填">
                                                    <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                </el-select>
                                            </el-col>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="note" label="备注">
                                        <template slot-scope="scope">
                                            <el-input
                                                type="textarea"
                                                v-model="scope.row.note"
                                                placeholder="选填">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                </el-table><br><br>
                                <el-form-item label="收集生产记录功能">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <!-- 收集生产记录功能测试明细 -->
                                <el-table
                                    :data="collectLogRecord"
                                    border
                                    style="width: 100%;">
                                    <el-table-column prop="testInfo" label="测试内容" width="180">
                                    </el-table-column>
                                    <el-table-column prop="step" label="测试步骤">
                                        <template slot-scope="scope">
                                            <div v-for="(item,index) in scope.row.step" :key="index">
                                                {{index+1}}.{{item}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="result" label="测试结果">
                                        <template slot-scope="scope">
                                             <el-col :span="10">
                                                <el-select v-model="scope.row.result" placeholder="必填">
                                                    <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                </el-select>
                                            </el-col>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="note" label="备注">
                                        <template slot-scope="scope">
                                            <el-input
                                                type="textarea"
                                                v-model="scope.row.note"
                                                placeholder="选填">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                </el-table><br><br>
                                <el-form-item label="离线授权">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <!-- 离线授权测试明细 -->
                                <el-table
                                    :data="offlineTest"
                                    border
                                    style="width: 100%;">
                                    <el-table-column prop="testInfo" label="测试内容" width="180">
                                    </el-table-column>
                                    <el-table-column prop="step" label="测试步骤">
                                        <template slot-scope="scope">
                                            <div v-for="(item,index) in scope.row.step" :key="index">
                                                {{index+1}}.{{item}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="result" label="测试结果">
                                        <template slot-scope="scope">
                                             <el-col :span="10">
                                                <el-select v-model="scope.row.result" placeholder="必填">
                                                    <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                </el-select>
                                            </el-col>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="note" label="备注">
                                        <template slot-scope="scope">
                                            <el-input
                                                type="textarea"
                                                v-model="scope.row.note"
                                                placeholder="选填">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                </el-table><br><br>
                                <el-form-item label="在线授权">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <!-- 在线授权测试明细 -->
                                <el-table
                                    :data="onlineTest"
                                    border
                                    style="width: 100%;">
                                    <el-table-column prop="testInfo" label="测试内容" width="180">
                                    </el-table-column>
                                    <el-table-column prop="step" label="测试步骤">
                                        <template slot-scope="scope">
                                            <div v-for="(item,index) in scope.row.step" :key="index">
                                                {{index+1}}.{{item}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="result" label="测试结果">
                                        <template slot-scope="scope">
                                             <el-col :span="10">
                                                <el-select v-model="scope.row.result" placeholder="必填">
                                                    <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                </el-select>
                                            </el-col>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="note" label="备注">
                                        <template slot-scope="scope">
                                            <el-input
                                                type="textarea"
                                                v-model="scope.row.note"
                                                placeholder="选填">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                </el-table><br><br>
                                <el-form-item label="中转软件">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option
                                                v-for="item in [{label:'PASS','value':'PASS'},{label:'FAIL','value':'FAIL'}]"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <p>以上测试都是使用中转软件转发的方案以和工厂的网络模式匹配</p>
                            </el-form>
                        </el-collapse-item>
                        <el-collapse-item title="压力测试" name="3">
                            <el-form>
                                <el-form-item label="授权模块压力测试">
                                    <el-col :span="10">
                                        <el-select v-model="formInline.user" placeholder="必填">
                                            <el-option
                                                v-for="item in [{label:'PASS','value':'PASS'},{label:'FAIL','value':'FAIL'}]"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <!-- 压力测试明细 -->
                                <el-table
                                    :data="pressureTest"
                                    border
                                    style="width: 100%;">
                                    <el-table-column prop="testInfo" label="测试内容" width="180">
                                    </el-table-column>
                                    <el-table-column prop="step" label="测试步骤">
                                        <template slot-scope="scope">
                                            <div v-for="(item,index) in scope.row.step" :key="index">
                                                {{index+1}}.{{item}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="result" label="测试结果">
                                        <template slot-scope="scope">
                                             <el-col :span="10">
                                                <el-select v-model="scope.row.result" placeholder="必填">
                                                    <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                </el-select>
                                            </el-col>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="note" label="备注">
                                        <template slot-scope="scope">
                                            <el-input
                                                type="textarea"
                                                v-model="scope.row.note"
                                                placeholder="选填">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                </el-table><br><br>
                            </el-form>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name:'Mpcloud',
    data() {
        return {
            formInline: {
                user: '',
                region: ''
            },
            activeName: 'third',
            activeTestName:'1',
            collectLogFile: [
                {
                    testInfo:'单台测试PC',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '按测试架开始测试',
                        '测试完后5分钟左右在云平台后台日志存放目录查找是否有AGENT_<测试PC网卡MAC号>目录，且该目录下有.txt日志文件',
                        '如果3步骤正常，则对比服务器的.txt是否和测试PC上的.txt完全一致',
                        '测试10次'
                    ],
                    result:'',
                    note:''
                    
                },{
                    testInfo:'多台测试PC',
                    step:[
                        '4台PC，每台4个测试架',
                        '每台测试PC测试步骤同单台测试PC的步骤',
                        '测试次数为200次'
                    ],
                    result:'',
                    note:''
                    
                },{
                    testInfo:'测试完立即关闭MPTool',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '按测试架开始测试',
                        '测试完后立即关闭MPTool',
                        '等待5分钟左右在云平台后台日志存放目录查找是否有AGENT_<测试PC网卡MAC号>目录，且该目录下有.txt日志文件',
                        '如果4步骤正常，则对比服务器的.txt是否和测试PC上的.txt完全一致',
                        '测试次数2次'
                    ],
                    result:'',
                    note:''
                    
                },{
                    testInfo:'断网测试',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '断掉测试PC  WIFI',
                        '按测试架开始测试',
                        '测试完后连接测试PC网络，2分钟左右在云平台生产记录查询页面是否可以查到与测试相同的条目',
                        '如果4步骤正常，则对比服务器的.txt是否和测试PC上的.txt完全一致',
                        '测试次数2次'
                    ],
                    result:'',
                    note:''
                    
                },
            ],
            collectLogRecord: [
                {
                    testInfo:'单台测试PC',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '按测试架开始测试',
                        '测试完后2分钟左右在云平台生产记录查询页面是否可以查到与测试相同的条目',
                        '测试10次'
                    ],
                    result:'',
                    note:''
                    
                },{
                    testInfo:'多台测试PC',
                    step:[
                        '4台PC，每台4个测试架',
                        '每台测试PC测试步骤同单台测试PC的步骤',
                        '测试次数为200次'
                    ],
                    result:'',
                    note:''
                    
                },{
                    testInfo:'测试完立即关闭MPTool',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '按测试架开始测试',
                        '测试完后立即关闭MPTool',
                        '测试完后2分钟左右在云平台生产记录查询页面是否可以查到与测试相同的条目',
                        '测试次数2次'
                    ],
                    result:'',
                    note:''
                    
                },{
                    testInfo:'断网测试',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '断掉测试PC  WIFI',
                        '按测试架开始测试',
                        '测试完后连接测试PC网络，2分钟左右在云平台生产记录查询页面是否可以查到与测试相同的条目',
                        '测试次数2次'
                    ],
                    result:'',
                    note:''
                    
                },
            ],
            offlineTest: [
                {
                    testInfo:'登陆、查看订单(离线Key授权工具使用)',
                    step:[
                        '填入云平台帐号密码点击登陆',
                        '无错误弹框出现，并可以在订单栏看到订单'
                    ],
                    result:'',
                    note:''
                    
                },{
                    testInfo:'查找设备(离线Key授权工具使用)',
                    step:[
                        '插入Ukey',
                        '等待USB设备上盘点击查找设备',
                        '在设备盘符处出现Ukey在windows系统中的盘符'
                    ],
                    result:'',
                    note:''
                },{
                    testInfo:'查看订单权限(离线Key授权工具使用)',
                    step:[
                        '用两个用户登陆，其中一个在云平台可以查看到一个订单；另一个在云平台可以看到三个订单',
                        '在授权工具上登陆这两个帐号，看看显示的订单数是否能云平台上相同'
                    ],
                    result:'',
                    note:''
                },{
                    testInfo:'授权(离线Key授权工具使用)',
                    step:[
                        '登陆后，查找设备后，点击相应的订单，然后在申请数量填写一个数字',
                        '点击授权',
                        '使用Ukey到Mptool使用，查看离线剩余授权数是否和申请的一致',
                        '从云平台查看剩余离线授权总数是否与等于总离线授权总数和步骤3申请数量之差'
                    ],
                    result:'',
                    note:''
                },{
                    testInfo:'正常使用',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '插上授权好的离线Key，断开测试PC网络',
                        '运行MPTool，查看Mptool下端离线授权数量',
                        '按测试架开始测试',
                        '查看测试是否正常进行，Mptool下端离线授权数量是否减了1个',
                        '测试10次'
                    ],
                    result:'',
                    note:''
                },{
                    testInfo:'Ukey没授权数量',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '插上未授权好的离线Key，断开测试PC网络',
                        '运行MPTool，查看Mptool下端离线授权数量',
                        '按测试架开始测试',
                        '查看测试是否有弹出提示框“授权不足或验证失败”',
                        '测试1次'
                    ],
                    result:'',
                    note:''
                },{
                    testInfo:'Ukey授权订单和MPTool配置订单不一致',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '插上授权好的离线Key（授权的是另一个订单），断开测试PC网络',
                        '运行MPTool，查看Mptool下端离线授权数量',
                        '按测试架开始测试',
                        '查看测试是否有弹出提示框“授权不足或验证失败',
                        '测试1次'
                    ],
                    result:'',
                    note:''
                },{
                    testInfo:'离线在线授权切换',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '插上授权好的离线Key（授权的是另一个订单），断开测试PC网络',
                        '运行MPTool，查看Mptool下端离线授权数量',
                        '按测试架开始测试',
                        'Mptool下端离线授权数量是否减了1个',
                        '连上网络，按测试架开始测试',
                        'Mptool下端在线授权数量是否减了1个',
                        '再次断开网络依次测试',
                        '轮流测试6次'
                    ],
                    result:'',
                    note:''
                }
            ],
            onlineTest: [
                {
                    testInfo:'单台测试PC',
                    step:[
                        '从MPS订单的软件列表上下载MPTool到测试PC上',
                        '确保测试连接网络正常，按测试架开始测试',
                        '测试完后5分钟左右在云平台后台日志存放目录查找是否有AGENT_<测试PC网卡MAC号>目录，且该目录下有.txt日志文件',
                        '查看测试是否正常进行，Mptool下端在线授权数量是否有减少1个',
                        '测试10次'
                    ],
                    result:'',
                    note:''
                    
                },{
                    testInfo:'多台测试PC',
                    step:[
                        '4台PC，每台4个测试架',
                        '每台测试PC测试步骤同单台测试PC的步骤',
                        '观察Mptool下端在线授权数量是否有所减少',
                        '测试次数为200次'
                    ],
                    result:'',
                    note:''
                }
            ],
            pressureTest: [
               {
                    testInfo:'获取授权API压力测试',
                    step:[
                        '172.16.9.229服务器运行测试程序（229配置：24核CPU/32Gbytes内存）',
                        '测试程序运行3000个协程，每个线程不休眠持续完成一个向服务器取授权的动作',
                        '测试订单在线总授权数：10000000',
                        '跑完测试订单授权数约：900000',
                        '测试时间约11小时'
                    ],
                    result:'',
                    note:''
                    
                }, 
            ]
        }
    },
    methods:{
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        }
    }
}
</script>

<style scoped>
</style>


