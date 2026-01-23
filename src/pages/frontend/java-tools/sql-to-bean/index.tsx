import React, { useState } from 'react';
import { Typography, Input, Button, message, theme, Tooltip, Radio } from 'antd';
import { CopyOutlined, DeleteOutlined, FormatPainterOutlined, CheckOutlined } from '@ant-design/icons';
import type { CheckboxGroupProps } from "antd/es/checkbox";

// Syntax Highlighting
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-coy.css'; // Light, natural theme

const { Text } = Typography;

const namingStrategyOptions: CheckboxGroupProps<string>['options'] = [
    { label: '下划线转驼峰', value: 'camel' },
    { label: '驼峰转下划线', value: 'snake' }
];

const SqlToBean: React.FC = () => {
    const { token } = theme.useToken();
    const [sqlInput, setSqlInput] = useState('');

    // Global style override for the code editor's textarea to remove the black border on focus
    // Global style override for the code editor's textarea to remove the black border on focus
    const globalStyle = `
      .custom-code-editor textarea {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
      }
    `;
    const [javaOutput, setJavaOutput] = useState('');
    const [copied, setCopied] = useState(false);

    // Options
    const [packageName, setPackageName] = useState('com.example.entity');
    const [namingStrategy, setNamingStrategy] = useState<'camel' | 'snake' | 'original'>('camel');

    // Utility: Snake to Camel
    const toCamelCase = (str: string) => {
        return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    };

    // Utility: Camel to Snake
    const toSnakeCase = (str: string) => {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()} `);
    };

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const convertSqlToBeanc = () => {
        if (!sqlInput.trim()) {
            message.warning('请输入 SQL 语句');
            return;
        }

        try {
            const lines = sqlInput.split('\n');
            const fields: { name: string; type: string; comment: string }[] = [];
            let tableName = 'MyEntity';

            const columnRegex = /^\s*[`"]?([a-zA-Z0-9_]+)[`"]?\s+([a-zA-Z]+)(.*)/i;
            const commentRegex = /COMMENT\s+['"](.*?)['"]/i;
            const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?/i;

            lines.forEach(line => {
                line = line.trim();

                if (line.toUpperCase().startsWith('CREATE')) {
                    const tableMatch = line.match(tableRegex);
                    if (tableMatch) {
                        tableName = tableMatch[1];
                        tableName = toCamelCase(tableName);
                        tableName = capitalize(tableName);
                    }
                }

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
                    const originalName = match[1];
                    const sqlType = match[2].toUpperCase();

                    let javaType = 'String';
                    if (['INT', 'TINYINT', 'SMALLINT', 'MEDIUMINT', 'INTEGER'].some(t => sqlType.includes(t))) {
                        javaType = 'Integer';
                    } else if (['BIGINT'].some(t => sqlType.includes(t))) {
                        javaType = 'Long';
                    } else if (['DECIMAL', 'NUMERIC', 'DOUBLE'].some(t => sqlType.includes(t))) {
                        javaType = 'Double';
                    } else if (['FLOAT'].some(t => sqlType.includes(t))) {
                        javaType = 'Float';
                    } else if (['BIT', 'BOOL', 'BOOLEAN'].some(t => sqlType.includes(t))) {
                        javaType = 'Boolean';
                    } else if (['DATETIME', 'TIMESTAMP', 'DATE', 'TIME'].some(t => sqlType.includes(t))) {
                        javaType = 'Date';
                    }

                    let comment = '';
                    const commentMatch = line.match(commentRegex);
                    if (commentMatch) {
                        comment = commentMatch[1];
                    }

                    let fieldName = originalName;
                    if (namingStrategy === 'camel') {
                        fieldName = toCamelCase(originalName);
                    } else if (namingStrategy === 'snake') {
                        fieldName = toSnakeCase(originalName);
                    }

                    fields.push({ name: fieldName, type: javaType, comment });
                }
            });

            const finalClassName = tableName;
            let code = '';
            if (packageName) code += `package ${packageName};\n\n`;

            code += `import java.util.Date;\n`;
            code += `import lombok.Data;\n\n`;
            code += `@Data\n`;

            code += `public class ${finalClassName} {\n`;

            fields.forEach(f => {
                if (f.comment) code += `    /**\n     * ${f.comment}\n     */\n`;
                code += `    private ${f.type} ${f.name};\n\n`;
            });
            code += `}`;
            setJavaOutput(code);
            message.success(`已生成 ${finalClassName}`);
        } catch (e) {
            console.error('SQL Parse Error', e);
            message.error('解析失败');
        }
    };

    const copyToClipboard = () => {
        if (!javaOutput) return;
        navigator.clipboard.writeText(javaOutput);
        setCopied(true);
        message.success('已复制');
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setSqlInput('');
        setJavaOutput('');
    };

    const sampleSql = `create table user_info
                       (
                           \`user_id\`     bigint(20) not null AUTO_INCREMENT COMMENT '用户ID',
                           \`user_name\`   varchar(50) default null COMMENT '用户名',
                           \`create_time\` datetime    default null COMMENT '创建时间',
                           primary key (\`user_id\`)
                       ) COMMENT='用户信息表';`;

    // Shared Editor Styles
    const editorStyle = {
        fontFamily: '"Fira Code", "Fira Mono", "Menlo", "Consolas", monospace',
        fontSize: 14,
        lineHeight: 1.6,
        backgroundColor: '#fff', // Match natural theme
        minHeight: '100%',
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
            {/* Toolbar */}
            <style>{globalStyle}</style>
            <div style={{
                padding: '12px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexShrink: 0,
                background: '#fff'
            }}>
                {/* Actions */}
                <Button type="primary" onClick={convertSqlToBeanc} style={{ paddingLeft: 32, paddingRight: 32 }}>
                    生成
                </Button>

                <Button
                    variant="solid"
                    color="purple"
                    onClick={() => setSqlInput(sampleSql)}
                    icon={<FormatPainterOutlined />}
                >
                    示例
                </Button>
                <Button
                    danger
                    type="primary"
                    onClick={clearAll}
                    icon={<DeleteOutlined />}
                >
                    清空
                </Button>

                <div style={{ width: 1, height: 24, background: '#f0f0f0', margin: '0 12px' }} />

                {/* Options */}
                <Radio.Group
                    buttonStyle="solid"
                    options={namingStrategyOptions}
                    value={namingStrategy}
                    optionType="button"
                    onChange={(e) => setNamingStrategy(e.target.value)}
                />

                <div style={{ flex: 1 }} />

                {/* Branding/Extra */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Input
                        prefix={<span style={{ color: '#9ca3af', fontSize: 12 }}>package</span>}
                        value={packageName}
                        onChange={e => setPackageName(e.target.value)}
                        placeholder="com.example.entity"
                        variant="borderless"
                        style={{ width: 220, background: token.colorFillTertiary, borderRadius: 6 }}
                    />
                    <Text strong style={{ color: token.colorPrimary }}>SQL转Java实体</Text>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
                {/* Left: Input */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', overflow: 'auto' }}>
                    <div style={{ flex: 1, padding: 24, minHeight: '100%' }} className="custom-code-editor">
                        <Editor
                            value={sqlInput}
                            onValueChange={code => setSqlInput(code)}
                            highlight={code => highlight(code, languages.sql, 'sql')}
                            padding={0}
                            style={editorStyle}
                            placeholder="在此粘贴 SQL 语句..."
                        />
                    </div>
                </div>

                {/* Right: Output */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fdfdfd', position: 'relative', overflow: 'auto' }}>
                    {/* Floating Copy Button */}
                    <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                        <Tooltip title="复制到剪贴板">
                            <Button
                                type={copied ? 'primary' : 'default'}
                                variant="filled"
                                color={copied ? 'green' : 'default'}
                                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                                onClick={copyToClipboard}
                                disabled={!javaOutput}
                            >
                                {copied ? '已复制' : '复制代码'}
                            </Button>
                        </Tooltip>
                    </div>

                    <div style={{ flex: 1, padding: 24, minHeight: '100%' }} className="custom-code-editor">
                        {javaOutput ? (
                            <Editor
                                value={javaOutput}
                                onValueChange={() => { }} // Read only
                                highlight={code => highlight(code, languages.java, 'java')}
                                padding={0}
                                style={{
                                    ...editorStyle,
                                    backgroundColor: '#fdfdfd',
                                }}
                                readOnly
                            />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                请在左侧输入 SQL 并点击“生成”按钮
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SqlToBean;
