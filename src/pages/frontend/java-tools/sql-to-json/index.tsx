import React, { useState } from 'react';
import { Row, Col, Typography, Card, Input, Button, Space, message } from 'antd';
import { ArrowRightOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const SqlToJson: React.FC = () => {
    const [sqlInput, setSqlInput] = useState('');
    const [jsonOutput, setJsonOutput] = useState('');
    // const [mockCount, setMockCount] = useState(1); // Future: allow multiple records

    const convertSqlToJson = () => {
        if (!sqlInput.trim()) {
            message.warning('请输入 SQL 语句');
            return;
        }

        try {
            // Basic parsing logic for CREATE TABLE statements
            // This is a naive regex parser and won't handle complex nested structures perfectly
            // but is sufficient for the toolscat.com use case.

            const lines = sqlInput.split('\n');
            const resultObj: Record<string, any> = {};

            // Regex to match column definitions roughly:
            // `column_name` DATA_TYPE ...
            // or column_name DATA_TYPE ...
            const columnRegex = /^\s*[`"]?([a-zA-Z0-9_]+)[`"]?\s+([a-zA-Z]+)(.*),?\s*$/i;

            lines.forEach(line => {
                line = line.trim();
                // Skip comments and common non-column lines
                if (line.startsWith('--') || line.startsWith('/*') ||
                    line.toUpperCase().startsWith('CREATE') ||
                    line.toUpperCase().startsWith('PRIMARY') ||
                    line.toUpperCase().startsWith('KEY') ||
                    line.toUpperCase().startsWith('UNIQUE') ||
                    line.toUpperCase().startsWith('INDEX') ||
                    line.toUpperCase().startsWith('CONSTRAINT') ||
                    line === '(' || line === ');' || line === ')') {
                    return;
                }

                const match = line.match(columnRegex);
                if (match) {
                    const colName = match[1];
                    const colType = match[2].toUpperCase();
                    // const extra = match[3];

                    let mockValue: any = "";

                    if (['INT', 'TINYINT', 'SMALLINT', 'MEDIUMINT', 'BIGINT', 'INTEGER', 'BIT'].some(t => colType.includes(t))) {
                        mockValue = 0; // Number
                    } else if (['DECIMAL', 'FLOAT', 'DOUBLE', 'NUMERIC'].some(t => colType.includes(t))) {
                        mockValue = 0.00;
                    } else if (colType.includes('BOOL')) {
                        mockValue = false;
                    } else if (['DATE', 'DATETIME', 'TIMESTAMP', 'TIME'].some(t => colType.includes(t))) {
                        mockValue = "2024-01-01 12:00:00";
                    } else {
                        // Default to string for VARCHAR, TEXT, CHAR, etc.
                        mockValue = "";
                    }

                    // Try to extract comment if available for better mock data?
                    // Not crucial for MVP

                    resultObj[colName] = mockValue;
                }
            });

            if (Object.keys(resultObj).length === 0) {
                // If it failed to find columns, maybe it's not a CREATE TABLE statement?
                // Fallback or alert?
                message.info('未识别到有效的列定义，请检查 SQL 格式 (CREATE TABLE 语句)');
            }

            setJsonOutput(JSON.stringify(resultObj, null, 4));
            message.success('转换成功');

        } catch (e) {
            console.error('SQL Parse Error', e);
            message.error('转换失败，请检查 SQL 语法');
        }
    };

    const copyToClipboard = () => {
        if (!jsonOutput) return;
        navigator.clipboard.writeText(jsonOutput);
        message.success('已复制 JSON 到剪贴板');
    };

    const clearAll = () => {
        setSqlInput('');
        setJsonOutput('');
    };

    const sampleSql = `CREATE TABLE user_info (
  \`id\` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  \`username\` varchar(50) DEFAULT NULL COMMENT '用户名',
  \`age\` int(3) DEFAULT NULL COMMENT '年龄',
  \`balance\` decimal(10,2) DEFAULT NULL COMMENT '余额',
  \`create_time\` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (\`id\`)
);`;

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto', height: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={2}>SQL 转 JSON</Title>
                <Text type="secondary">
                    解析 SQL 建表语句 (DDL)，自动生成对应的 JSON 数据结构 (Mock Data)。
                </Text>
            </div>

            <Row gutter={24} style={{ height: 'calc(100% - 120px)' }}>
                <Col xs={24} lg={11} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Card
                        title="SQL 输入 (CREATE TABLE)"
                        bordered={true}
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 12 }}
                        extra={<Button size="small" type="link" onClick={() => setSqlInput(sampleSql)}>填入示例文本</Button>}
                    >
                        <TextArea
                            value={sqlInput}
                            onChange={(e) => setSqlInput(e.target.value)}
                            placeholder="请粘贴 Create Table 语句..."
                            className="hover-scrollbar"
                            style={{ flex: 1, fontFamily: 'monospace', resize: 'none', border: 'none', background: 'var(--color-bg-layout)' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
                    <Space direction="vertical">
                        <Button type="primary" shape="circle" size="large" icon={<ArrowRightOutlined />} onClick={convertSqlToJson} />
                        <Button shape="circle" size="large" icon={<DeleteOutlined />} onClick={clearAll} />
                    </Space>
                </Col>

                <Col xs={24} lg={11} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Card
                        title="JSON 结果"
                        bordered={true}
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 12 }}
                        extra={
                            <Button icon={<CopyOutlined />} size="small" onClick={copyToClipboard} disabled={!jsonOutput}>
                                复制 JSON
                            </Button>
                        }
                    >
                        <TextArea
                            value={jsonOutput}
                            readOnly
                            placeholder="结果将显示在这里..."
                            className="hover-scrollbar"
                            style={{ flex: 1, fontFamily: 'monospace', resize: 'none', border: 'none', background: 'var(--color-bg-layout)', color: 'var(--color-success-text)' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SqlToJson;
