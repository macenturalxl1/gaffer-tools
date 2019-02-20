/*
 * Copyright 2016-2018 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package uk.gov.gchq.gaffer.python.data.serialiser;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.python.util.Constants;

import java.util.HashMap;
import java.util.Map;

/**
* Converts a Gaffer Element to/from Json for passing between Java and Python
*/
public class PythonElementJsonSerialiser extends PythonElementSerialiser<Element, Map<String, Object>> {

    private static final Logger LOGGER = LoggerFactory.getLogger(PythonElementJsonSerialiser.class);
    private Map<String, Object> map;

    public PythonElementJsonSerialiser() {
        super();
    }

    @Override
    public void setSerialiserConfig() {

    }

    @Override
    public boolean canHandle(final Class clazz) {
        return Element.class.equals(clazz);
    }

    @Override
    public Map<String, Object> serialise(final Element element) {
        map = new HashMap<>();
        try {
            map.put(Constants.JSON.getValue(), new String(JSONSerialiser.serialise(element)));
        } catch (final SerialisationException e) {
            LOGGER.error(e.getMessage());
        }
        return map;
    }

}
