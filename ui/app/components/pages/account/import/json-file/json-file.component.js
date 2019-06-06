import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, ButtonToolbar, Form} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import InputFile from "../../../../input/input.file.group.validation";
import Input from "../../../../input/input.group.validation";


export default class ImportJSONFile extends Component {

  static propTypes = {
    history: PropTypes.object,
    importNewAccount: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    addValidationMessage: PropTypes.func,
    handlePasswordChange: PropTypes.func,
    isValid: PropTypes.func,
    formData: PropTypes.shape({
      file: PropTypes.object,
      password: PropTypes.string,
    }),
  };

  isValid () {
    const {formData: {file}, isValid} = this.props;

    if (!file) {
      return false;
    }

    return isValid();
  }

  onSubmit () {
    const {
      formData: {password, file},
      importNewAccount,
      addValidationMessage,
    } = this.props;
    return importNewAccount("JSON File", [file, password])
      .catch(e => {
        addValidationMessage({
          name: "file",
          reason: e.message,
        });
      });
  }

  render () {
    const {
      formData: {password},
      onChange,
      handlePasswordChange,
    } = this.props;

    return (
      <Form className="import-json-file" onSubmit={::this.onSubmit}>
        <InputFile
          type="file"
          name="file"
          onChange={onChange}
        />
        <Input
          name="password"
          type="password"
          defaultValue={password}
          onChange={handlePasswordChange}
        />

        <a
          href="https://github.com/MetaMask/faq/blob/master/README.md#q-i-cant-use-the-import-feature-for-uploading-a-json-file-the-window-keeps-closing-when-i-try-to-select-a-file"
          className="first-time-flow__link"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FormattedMessage id="pages.account.import.tabs.jsonFile.notWorking"/>
        </a>

        <ButtonToolbar>
          <Button
            bsStyle="primary"
            type="submit"
            disabled={!this.isValid()}
          >
            <FormattedMessage id="buttons.import"/>
          </Button>
        </ButtonToolbar>
      </Form>
    );
  }
}
