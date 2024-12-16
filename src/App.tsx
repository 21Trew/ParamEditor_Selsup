import React, { useState } from 'react';
import { Input, Button, Form, Typography, Space } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: any[]; // не используется в этом примере
}

interface Props {
  params: Param[];
  model: Model;
}

const ParamEditor: React.FC<Props> = ({ params, model }) => {
  const [paramValues, setParamValues] = useState(model.paramValues);
  const [newParamName, setNewParamName] = useState('');
  const [paramsList, setParamsList] = useState(params);
  const [modelOutput, setModelOutput] = useState('');

  const handleChange = (paramId: number, value: string) => {
    setParamValues((prevParamValues) =>
      prevParamValues.map((paramValue) =>
        paramValue.paramId === paramId ? { ...paramValue, value } : paramValue
      )
    );
  };

  const addParam = () => {
    const newParam: Param = {
      id: paramsList.length + 1,
      name: newParamName,
      type: 'string',
    };
    setParamsList((prevParams) => [...prevParams, newParam]);
    setNewParamName('');
    setParamValues((prevParamValues) => [
      ...prevParamValues,
      { paramId: newParam.id, value: '' },
    ]);
  };

  const deleteParam = (paramId: number) => {
    setParamsList((prevParams) => prevParams.filter(param => param.id !== paramId));
    setParamValues((prevParamValues) => prevParamValues.filter(paramValue => paramValue.paramId !== paramId));
  };

  const areAllParametersFilled = paramValues.every(pv => pv.value.trim() !== '');

  const getModel = () => {
    const updatedModel: Model = {
      paramValues,
      colors: model.colors,
    };
    
    // Проверка на пустые значения
    const hasEmptyValues = paramValues.some(pv => !pv.value.trim());
    
    if (hasEmptyValues) {
      setModelOutput('Заполните все параметры');
      return;
    }
    
    setModelOutput(JSON.stringify(updatedModel, null, 2));
  };

  return (
    <div style={{ padding: `20px`, display: 'flex', gap: '30px' }}>
      <div>
      <Title level={3}>Редактор параметров</Title>

      <Form layout="vertical">
        {paramsList.map((param) => (
          <Form.Item key={param.id} label={param.name}>
            <Space>
              <Input
                value={
                  paramValues.find((paramValue) => paramValue.paramId === param.id)
                    ?.value || ''
                }
                onChange={(event) => handleChange(param.id, event.target.value)}
              />

              <Button onClick={() => deleteParam(param.id)} style={{ marginLeft: '10px' }}>
                Удалить
              </Button>
            </Space>
          </Form.Item>
        ))}
        <Form.Item label="Добавить новый параметр">
          <Input
            value={newParamName}
            onChange={(event) => setNewParamName(event.target.value)}
            placeholder="Введите имя нового параметра"
          />

          <Button 
            type="primary" 
            onClick={addParam} 
            style={{ marginTop: '10px' }}
            disabled={!newParamName.trim()}
          >
            Добавить параметр
          </Button>
        </Form.Item>

        <Button 
          type="default" 
          onClick={getModel}
          disabled={!areAllParametersFilled}
          style={{
            opacity: areAllParametersFilled ? 1 : 0.5,
            cursor: areAllParametersFilled ? 'pointer' : 'not-allowed'
          }}
        >
          Получить модель
        </Button>
      </Form>
      </div>

      <div>
        <Title level={4}>Вывод модели:</Title>

        <TextArea
          rows={15}
          value={modelOutput}
          readOnly
          style={{ marginTop: '10px', minWidth: '250px' }}
        />
      </div>
    </div>
  );
};

const App = () => {
  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
  ];

  const model: Model = {
    paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'макси' },
    ],
    colors: [],
  };

  return <ParamEditor params={params} model={model} />;
};

export default App;