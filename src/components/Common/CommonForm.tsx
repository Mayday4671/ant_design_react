import React from 'react';
import { Form, Input, Select, Switch, DatePicker, Row, Col, Button } from 'antd';
import type { FormInstance, FormProps } from 'antd';

export type FieldType = 'input' | 'select' | 'switch' | 'date' | 'textarea' | 'password' | 'custom';

export interface SelectOption {
    label: string;
    value: string | number | boolean;
}

export interface FormField {
    name: string | string[];
    label: string;
    type: FieldType;
    rules?: any[];
    placeholder?: string;
    options?: SelectOption[]; // For select
    colSpan?: number;
    hidden?: boolean;
    disabled?: boolean;
    dependencies?: string[];
    component?: React.ReactNode; // For custom type
}

interface CommonFormProps extends FormProps {
    fields: FormField[];
    form?: FormInstance;
    onFinish: (values: any) => void;
    submitText?: string;
    showSubmit?: boolean;
    loading?: boolean;
    layout?: 'horizontal' | 'vertical' | 'inline';
    grid?: boolean; // Enable grid layout for fields
}

const CommonForm: React.FC<CommonFormProps> = ({
    fields,
    onFinish,
    submitText = 'Submit',
    showSubmit = true,
    loading = false,
    layout = 'vertical',
    grid = false,
    ...rest
}) => {

    const renderFieldInput = (field: FormField) => {
        switch (field.type) {
            case 'select':
                return (
                    <Select placeholder={field.placeholder} disabled={field.disabled}>
                        {field.options?.map((opt) => (
                            <Select.Option key={String(opt.value)} value={opt.value}>
                                {opt.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
            case 'switch':
                return <Switch disabled={field.disabled} />;
            case 'date':
                return <DatePicker style={{ width: '100%' }} disabled={field.disabled} />;
            case 'textarea':
                return <Input.TextArea placeholder={field.placeholder} rows={4} disabled={field.disabled} />;
            case 'password':
                return <Input.Password placeholder={field.placeholder} disabled={field.disabled} />;
            case 'custom':
                return field.component;
            case 'input':
            default:
                return <Input placeholder={field.placeholder} disabled={field.disabled} />;
        }
    };

    const renderItem = (field: FormField) => (
        <Form.Item
            key={String(field.name)}
            name={field.name}
            label={field.label}
            rules={field.rules}
            valuePropName={field.type === 'switch' ? 'checked' : 'value'}
            hidden={field.hidden}
            dependencies={field.dependencies}
        >
            {renderFieldInput(field)}
        </Form.Item>
    );

    return (
        <Form layout={layout} onFinish={onFinish} {...rest}>
            {grid ? (
                <Row gutter={24}>
                    {fields.map((field) => (
                        <Col span={field.colSpan || 24} key={String(field.name)}>
                            {renderItem(field)}
                        </Col>
                    ))}
                </Row>
            ) : (
                fields.map((field) => renderItem(field))
            )}

            {showSubmit && (
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {submitText}
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
};

export default CommonForm;
