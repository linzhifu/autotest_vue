<template>
    <div>
        <!-- 返回上一级 -->
        <div>
            <a href="#" @click.prevent="go_back">
                <i class="el-icon-d-arrow-left"></i>返回上一级<br><br>
            </a>
            <div>项目：{{this.$route.query.projectName}}</div><br>
            <el-button type="primary" @click="new_report">提交</el-button>
        </div><br>
        <!-- 测试报告 -->
        <div>
             <el-tabs v-model="activeName" type="border-card">
                 <!-- 平台版本 -->
                <el-tab-pane label="平台版本" name="first">
                    <el-form label-position="right" label-width="150px" :model="mpcloudReport">
                        <el-form-item label="量产云平台">
                            <el-col :span="4">
                                <el-input v-model="mpcloudReport.version['量产云平台']" placeholder="如:V1.0 (必填)" width="100"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="电流板">
                            <el-col :span="4">
                                <el-input v-model="mpcloudReport.version['电流板']" placeholder="如:V1.0.1_190112 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="MPTool">
                            <el-col :span="4">
                                <el-input v-model="mpcloudReport.version['MPTool']" placeholder="如:V1.2.0.4 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="离线Key授权工具">
                            <el-col :span="4">
                                <el-input v-model="mpcloudReport.version['离线Key授权工具']" placeholder="如:V1.1.3.0 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="syncAgent">
                            <el-col :span="4">
                                <el-input v-model="mpcloudReport.version['syncAgent']" placeholder="如:V0.0.11 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="TransferStation">
                            <el-col :span="4">
                                <el-input v-model="mpcloudReport.version['transferStation']" placeholder="如:V0.0.01 (必填)"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <!-- Release Note -->
                <el-tab-pane label="Release Note" name="second">
                    <el-input
                        type="textarea"
                        :rows="15"
                        v-model="mpcloudReport.releaseNote"
                        placeholder="请输入Release Note (必填)">
                    </el-input>
                </el-tab-pane>
                <!-- 测试汇总 -->
                <el-tab-pane label="测试汇总" name="third">
                    <el-collapse v-model="activeTestName" accordion>
                        <!-- 权限测试 -->
                        <el-collapse-item title="权限测试" name="1">
                            <el-collapse class="funtest" v-model="activeRoleName" accordion>
                                <!-- 产品-产品经理 -->
                                <el-collapse-item title="产品-产品经理" name="1">
                                    <el-table
                                        :data="mpcloudReport.product_pm"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 项目-产品经理 -->
                                <el-collapse-item title="项目-产品经理" name="2">
                                    <el-table
                                        :data="mpcloudReport.model_pm"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 产品-研发工程师 -->
                                <el-collapse-item title="产品-研发工程师" name="3">
                                    <el-table
                                        :data="mpcloudReport.product_rd"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 项目-研发工程师 -->
                                <el-collapse-item title="项目-研发工程师" name="4">
                                    <el-table
                                        :data="mpcloudReport.model_rd"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 产品-测试工程师 -->
                                <el-collapse-item title="产品-测试工程师" name="5">
                                    <el-table
                                        :data="mpcloudReport.product_te"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 项目-测试工程师 -->
                                <el-collapse-item title="项目-测试工程师" name="6">
                                    <el-table
                                        :data="mpcloudReport.model_te"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 产品-PMC -->
                                <el-collapse-item title="产品-PMC" name="7">
                                    <el-table
                                        :data="mpcloudReport.product_pmc"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 项目-PMC -->
                                <el-collapse-item title="项目-PMC" name="8">
                                    <el-table
                                        :data="mpcloudReport.model_pmc"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 产品-产线工程师 -->
                                <el-collapse-item title="产品-产线工程师" name="9">
                                    <el-table
                                        :data="mpcloudReport.product_pe"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 项目-产线工程师 -->
                                <el-collapse-item title="项目-产线工程师" name="10">
                                    <el-table
                                        :data="mpcloudReport.model_pe"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 产品-项目工程师 -->
                                <el-collapse-item title="产品-项目工程师" name="11">
                                    <el-table
                                        :data="mpcloudReport.product_pj"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 项目-项目工程师 -->
                                <el-collapse-item title="项目-项目工程师" name="12">
                                    <el-table
                                        :data="mpcloudReport.model_pj"
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
                                                <el-col :span="6">
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
                                                        <el-option v-for="item in ['PASS','FAIL']" :key="item" :label="item" :value="item"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                    <el-button type="primary" :loading="loading" @click="testRole(scope.row.testInfo,scope.row)">{{testBtn}}</el-button>
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
                                    </el-table>
                                </el-collapse-item>
                            </el-collapse>
                        </el-collapse-item>
                        <el-collapse-item title="功能测试" name="2">
                            <el-collapse class="funtest" v-model="activeFunName" accordion>
                                <!-- 收集生产日志文件测试明细 -->
                                <el-collapse-item title="收集生产日志文件" name="1">
                                    <el-table
                                        :data="mpcloudReport.collectLogFile"
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
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 收集生产记录功能测试明细 -->
                                <el-collapse-item title="收集生产记录功能" name="2">
                                    <el-table
                                        :data="mpcloudReport.collectLogRecord"
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
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 离线授权测试明细 -->
                                <el-collapse-item title="离线授权测试" name="3">
                                    <el-table
                                        :data="mpcloudReport.offlineTest"
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
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 在线授权测试明细 -->
                                <el-collapse-item title="在线授权测试" name="4">
                                    <el-table
                                        :data="mpcloudReport.onlineTest"
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
                                                    <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
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
                                    </el-table>
                                </el-collapse-item>
                                <!-- 中转软件测试明细 -->
                                <el-collapse-item title="中转软件测试" name="5">
                                    <p>以上测试都是使用中转软件转发的方案以和工厂的网络模式匹配</p>
                                </el-collapse-item>
                            </el-collapse>
                        </el-collapse-item>
                        <el-collapse-item title="压力测试" name="3">
                            <!-- 压力测试明细 -->
                            <el-table
                                :data="mpcloudReport.pressureTest"
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
                                            <el-select v-model="scope.row.result" placeholder="必填" :class="{pass:scope.row.result=='PASS',fail:scope.row.result=='FAIL'}">
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
                            </el-table>
                        </el-collapse-item>
                        <el-collapse-item title="测试结果汇总" name="4">
                            <el-input
                                type="textarea"
                                v-model="mpcloudReport.result"
                                placeholder="必填（如：此次测试通过，该版本符合量产要求）">
                            </el-input>
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
            axios: this.axios,
            url: this.url,
            userId: this.storage.getItem('userId'),
            token: this.storage.getItem('token'),
            projectId: this.$route.query.projectId,
            projectName:this.$route.query.projectName,
            mpcloudReport: {
                version:{
                    '量产云平台':'',
                    '电流板':'',
                    'MPTool':'',
                    '离线Key授权工具':'',
                    'syncAgent':'',
                    'transferStation':''
                },
                releaseNote:'',
                product_pm:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'添加项目',
                        step:[
                            '登陆账户',
                            '添加新的项目',
                            '添加后前往添加项目角色和成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''  
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '修改产品名称和描述',
                            '查询核对产品列表',
                            '添加新的项目，并修改名称和描述',
                            '添加项目角色和成员',
                            '核对产品角色和成员',
                            '删除新建项目',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '关联量产工具',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                model_pm:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '查询产品列表并核对',
                            '查询项目列表并核对',
                            '添加项目角色和成员',
                            '核对产品角色和成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '关联量产工具',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                product_rd:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '查询产品列表并核对',
                            '查询项目列表并核对',
                            '核对产品角色和成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '下载测试软件',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'添加样品',
                        step:[
                            '登陆账户',
                            '添加样品和样品记录',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                model_rd:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '查询产品列表并核对',
                            '查询项目列表并核对',
                            '核对产品角色和成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '下载测试软件',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'添加样品',
                        step:[
                            '登陆账户',
                            '添加样品和样品记录',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                product_te:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '查询产品列表并核对',
                            '查询项目列表并核对',
                            '核对产品角色和成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '下载测试软件',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'添加样品',
                        step:[
                            '登陆账户',
                            '添加样品和样品记录',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                model_te:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '查询产品列表并核对',
                            '查询项目列表并核对',
                            '核对产品角色和成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '下载测试软件',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'添加样品',
                        step:[
                            '登陆账户',
                            '添加样品和样品记录',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                product_pmc:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '查询产品列表并核对',
                            '查询项目列表并核对',
                            '核对产品角色和成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'创建订单',
                        step:[
                            '登陆账户',
                            '创建新的订单',
                            '核对新订单列表',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '进行在线和离线授权',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                model_pmc:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '查询产品列表并核对',
                            '查询项目列表并核对',
                            '核对产品角色和成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'创建订单',
                        step:[
                            '登陆账户',
                            '创建新的订单',
                            '核对新订单列表',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '进行在线和离线授权',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                product_pe:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '下载测试软件',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                model_pe:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '下载测试软件',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                product_pj:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '查询产品列表并核对',
                            '查询项目列表并核对',
                            '核对产品项目成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
                model_pj:[
                    {
                        testInfo:'个人资料',
                        step:[
                            '登陆账户',
                            '修改个人资料和密码后退出登陆',
                            '用新的密码登陆',
                            '核对修改好的个人资料',
                            '测试5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'我的群组',
                        step:[
                            '登陆账户',
                            '添加一个新的群组',
                            '修改群名称和描述',
                            '删除本人并添加同一群组的所有成员',
                            '核对群组成员显示是否正确',
                            '删除新建群组',
                            '测试次数为5次'
                        ],
                        result:'NT',
                        note:''   
                    },{
                        testInfo:'产品列表',
                        step:[
                            '登陆账户',
                            '查询产品列表并核对',
                            '查询项目列表并核对',
                            '核对产品项目成员',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'订单列表',
                        step:[
                            '登陆账户',
                            '查询订单',
                            '核对订单列表',
                            '测试次数5次'
                        ],
                        result:'NT',
                        note:''
                    }
                ],
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
                        result:'NT',
                        note:''
                    },{
                        testInfo:'多台测试PC',
                        step:[
                            '4台PC，每台4个测试架',
                            '每台测试PC测试步骤同单台测试PC的步骤',
                            '测试次数为200次'
                        ],
                        result:'NT',
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
                        result:'NT',
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
                        result:'NT',
                        note:''  
                    }
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
                        result:'NT',
                        note:''
                    },{
                        testInfo:'多台测试PC',
                        step:[
                            '4台PC，每台4个测试架',
                            '每台测试PC测试步骤同单台测试PC的步骤',
                            '测试次数为200次'
                        ],
                        result:'NT',
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
                        result:'NT',
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
                        result:'NT',
                        note:'' 
                    }
                ],
                offlineTest: [
                    {
                        testInfo:'登陆、查看订单(离线Key授权工具使用)',
                        step:[
                            '填入云平台帐号密码点击登陆',
                            '无错误弹框出现，并可以在订单栏看到订单'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'查找设备(离线Key授权工具使用)',
                        step:[
                            '插入Ukey',
                            '等待USB设备上盘点击查找设备',
                            '在设备盘符处出现Ukey在windows系统中的盘符'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'查看订单权限(离线Key授权工具使用)',
                        step:[
                            '用两个用户登陆，其中一个在云平台可以查看到一个订单；另一个在云平台可以看到三个订单',
                            '在授权工具上登陆这两个帐号，看看显示的订单数是否能云平台上相同'
                        ],
                        result:'NT',
                        note:''
                    },{
                        testInfo:'授权(离线Key授权工具使用)',
                        step:[
                            '登陆后，查找设备后，点击相应的订单，然后在申请数量填写一个数字',
                            '点击授权',
                            '使用Ukey到Mptool使用，查看离线剩余授权数是否和申请的一致',
                            '从云平台查看剩余离线授权总数是否与等于总离线授权总数和步骤3申请数量之差'
                        ],
                        result:'NT',
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
                        result:'NT',
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
                        result:'NT',
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
                        result:'NT',
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
                        result:'NT',
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
                        result:'NT',
                        note:''
                        
                    },{
                        testInfo:'多台测试PC',
                        step:[
                            '4台PC，每台4个测试架',
                            '每台测试PC测试步骤同单台测试PC的步骤',
                            '观察Mptool下端在线授权数量是否有所减少',
                            '测试次数为200次'
                        ],
                        result:'NT',
                        note:'多台测试时，MPTool下端显示的剩余授权数量不是完全\
                            准确的，这是由于工具请求完授权显示数量在那里\
                            ，而另一台电脑去请求授权了，这个时候第一台电\
                            脑应该还没有进行下一次授权，所以没刷新，这个\
                            问题不好影响生产'
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
                        result:'NT',
                        note:''
                    }
                ],
                result:''
            },
            activeName: 'first',
            activeTestName:'0',
            activeFunName:'',
            activeRoleName:'0',
            testBtn:'开始测试',
            loading:false,
        }
    },
    methods:{
        // 返回上一级
        go_back() {
            this.$router.back(-1)
        },
        testRole(testInfo, row) {
            // alert(testInfo)
            // 产品-产品工程师
            if (this.activeRoleName==1) {
                var roleInfo = {
                    'role':
                    '产品-产品工程师',
                    'options': [{
                        '个人资料': false,
                    }, {
                        '我的群组': false
                    }, {
                        '添加项目': false
                    }, {
                        '产品列表': false
                    }, {
                        '订单列表': false
                    }]
                }
            }
            // 项目-产品工程师
            if (this.activeRoleName==2) {
                var roleInfo = {
                    'role': '项目-产品工程师',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '产品列表': false
                    }, {
                        '订单列表': false
                    }]
                }
            }
            // 产品-研发工程师
            if (this.activeRoleName==3) {
                 var roleInfo = {
                    'role':
                    '产品-研发工程师',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '产品列表': false
                    }, {
                        '订单列表': false
                    }, {
                        '添加样品': false
                    }]
                }
            }
            // 项目-研发工程师
            if (this.activeRoleName==4) {
                 var roleInfo = {
                    'role':
                    '项目-研发工程师',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '产品列表': false
                    }, {
                        '订单列表': false
                    }, {
                        '添加样品': false
                    }]
                }
            }
            // 产品-测试工程师
            if (this.activeRoleName==5) {
                 var roleInfo = {
                    'role':
                    '产品-测试工程师',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '产品列表': false
                    }, {
                        '订单列表': false
                    }, {
                        '添加样品': false
                    }]
                }
            }
            // 项目-测试工程师
            if (this.activeRoleName==6) {
                 var roleInfo = {
                    'role':
                    '项目-测试工程师',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '产品列表': false
                    }, {
                        '订单列表': false
                    }, {
                        '添加样品': false
                    }]
                }
            }
            // 产品-PMC
            if (this.activeRoleName==7) {
                 var roleInfo = {
                    'role':
                    '产品-pmc',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '产品列表': false
                    }, {
                        '创建订单': false
                    }, {
                        '订单列表': false
                    }]
                }
            }
            // 项目-PMC
            if (this.activeRoleName==8) {
                 var roleInfo = {
                    'role':
                    '项目-pmc',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '产品列表': false
                    }, {
                        '创建订单': false
                    }, {
                        '订单列表': false
                    }]
                }
            }
            // 产品-产线工程师
            if (this.activeRoleName==9) {
                 var roleInfo = {
                    'role': '产品-产线工程师',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '订单列表': false
                    }]
                }
            }
            // 项目-产线工程师
            if (this.activeRoleName==10) {
                 var roleInfo = {
                    'role': '项目-产线工程师',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '订单列表': false
                    }]
                }
            }
            // 产品-项目工程师
            if (this.activeRoleName==11) {
                 var roleInfo = {
                    'role': '产品-项目工程师',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '产品列表': false
                    }, {
                        '订单列表': false
                    }]
                }
            }
            // 项目-项目工程师
            if (this.activeRoleName==12) {
                 var roleInfo = {
                    'role': '项目-项目工程师',
                    'options': [{
                        '个人资料': false
                    }, {
                        '我的群组': false
                    }, {
                        '产品列表': false
                    }, {
                        '订单列表': false
                    }]
                }
            }
            for (var i=0;i<roleInfo.options.length;i++) {
                if (testInfo in roleInfo.options[i]) {
                    roleInfo.options[i][testInfo] = true
                }
            }
            // console.log(roleInfo)
            this.$confirm('1 请确认是否已打开浏览器服务端 </br>2 测试大约需几分钟请耐心等待 </br>3 即将开始 '+ testInfo + ' 测试', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true
                }).then(() => {
                    this.$message({
                        message: '测试开始',
                        type: 'success',
                        center: true
                    });
                    this.loading=true
                    this.testBtn='测试中...'
                    this.axios({
                        baseURL:this.url,
                        url:'/api/v1/webAutoTest/',
                        method:'patch',
                        data:roleInfo,
                    }).then(response=>{
                        // 判断是否成功
                        if (!response.data.errcode) {
                            this.$message({
                                message: response.data.errmsg,
                                type: 'success',
                                center: true,
                                showClose: true,
                                duration:0,
                            });
                            row.result = 'PASS'
                        }
                        else {
                            this.$message({
                                message: response.data.errmsg,
                                type: 'error',
                                center: true,
                                showClose: true,
                                duration:0,
                            })
                            row.result = 'FAIL'
                        }
                        this.loading=false
                        this.testBtn='开始测试'
                    },error=>{
                        this.$message({
                            message: '自动化测试平台异常，请检查网络',
                            type: 'error',
                            center: true,
                            showClose: true,
                            duration:0,
                        })
                        row.result = 'FAIL'
                        this.loading=false
                        this.testBtn='开始测试'
                    })
                }).catch(() => {      
            });
        },
        // 删除测试报告记录
        handleDelete(id) {
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/report/'+id+'/',
                method:'delete',
                params:params_data,
            })
        },
        // 新建测试报告
        new_report() {
            for (var i in this.mpcloudReport.version) {
                if (!this.mpcloudReport.version[i]) {
                    this.$message({
                        message: i + ' 版本不能为空',
                        type: 'error',
                        center: true
                    })
                    return
                }
            }
            if (!this.mpcloudReport.releaseNote) {
                this.$message({
                        message: 'Release Note 不能为空',
                        type: 'error',
                        center: true
                    })
                return
            }
            if (!this.mpcloudReport.result) {
                this.$message({
                        message: '测试结果汇总不能为空',
                        type: 'error',
                        center: true
                    })
                return
            }
            var body_data = {
                    'project': this.projectId,
                    'user': this.userId,
                    'version':JSON.stringify(this.mpcloudReport.version),
                    'releaseNote':this.mpcloudReport.releaseNote,
                    'allInfo':JSON.stringify(this.mpcloudReport)
                }
            var params_data = {'userId':this.userId,'token':this.token}
            this.axios({
                baseURL:this.url,
                url:'api/v1/report/',
                method:'post',
                params:params_data,
                data:body_data,
            }).then(response=>{
                // 判断是否成功
                if (!response.data.errcode) {
                    // this.$message({
                    //     message: '创建成功',
                    //     type: 'success',
                    //     center: true
                    // });
                    var reportId = response.data.data.id
                    var update_time = response.data.data.update_time
                    var fileName = this.dateLogFormat(update_time)
                    var body_data = {
                        'mpcloudReport': this.mpcloudReport,
                        'fileName':fileName
                    }
                    var params_data = {'userId':this.userId,'token':this.token}

                    this.axios({
                        baseURL:this.url,
                        url:'api/v1/mpcloudExcel/',
                        method:'post',
                        params:params_data,
                        data:body_data,
                    }).then(response=>{
                        if (!response.data.errcode) {
                            this.$message({
                                message: '创建成功',
                                type: 'success',
                                center: true
                            });
                            var url = '/home/report/'
                            var query = {}
                            this.$router.push({ path: url, query:query})
                        }
                        else {
                            this.$message({
                                message: response.data.errmsg,
                                type: 'error',
                                center: true
                            })
                            this.handleDelete(reportId)
                        }
                    },error=>{
                        this.$message({
                            message: '自动化测试平台异常，请检查网络',
                            type: 'error',
                            center: true
                        })
                        this.handleDelete(reportId)
                    })
                }
                else {
                    this.$message({
                        message: response.data.errmsg,
                        type: 'error',
                        center: true
                    })
                }
            },error=>{
                this.$message({
                    message: '自动化测试平台异常，请检查网络',
                    type: 'error',
                    center: true
                })
            })
        },
        dateLogFormat(time) {
            var date=new Date(time);
            var year=date.getFullYear();
            /* 在日期格式中，月份是从0开始的，因此要加0
            * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
            * */
            var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
            var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
            return year+month+day+hours+minutes+seconds+'.xlsx';
        }
    }
}
</script>

<style scoped>
</style>


