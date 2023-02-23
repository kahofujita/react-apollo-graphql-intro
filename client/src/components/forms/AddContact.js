import { v4 as uuidv4 } from "uuid";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import FormItem from "antd/es/form/FormItem";
import { useMutation } from "@apollo/client";
import { ADD_CONTACT, GET_CONTACTS } from "../../queries";

const AddContact = () => {
  const [id] = useState(uuidv4());
  const [addContact] = useMutation(ADD_CONTACT);

  const [form] = Form.useForm();
  const [, forceUpdate] = useState();

  useEffect(() => {
    forceUpdate([]);
  }, []);

  const onFinish = (values) => {
    const { firstName, lastName } = values;

    addContact({
      variables: {
        id,
        firstName,
        lastName,
      },
      update: (cache, { data: { addContact } }) => {
        const data = cache.readQuery({ query: GET_CONTACTS });
        cache.writeQuery({
          query: GET_CONTACTS,
          data: {
            ...data,
            contacts: [...data.contacts, addContact],
          },
        });
      },
    });
  };

  return (
    <Form
      name="add-contact-form"
      form={form}
      layout="inline"
      onFinish={onFinish}
      size="large"
      style={{ marginBottom: "40px" }}
    >
      <FormItem
        name="firstName"
        rules={[{ required: true, message: "Please enter your first name!" }]}
      >
        <Input placeholder="i.e. John" />
      </FormItem>
      <FormItem
        name="lastName"
        rules={[{ required: true, message: "Please enter your last name!" }]}
      >
        <Input placeholder="i.e. Smith" />
      </FormItem>
      <FormItem shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Add Contact
          </Button>
        )}
      </FormItem>
    </Form>
  );
};

export default AddContact;
